import type { User } from 'better-auth';
import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { tanstackStartCookies } from 'better-auth/tanstack-start';
import { getDb } from '@/db';
import { userFiles } from '@/db/app.schema';
import { user } from '@/db/auth.schema';
import { sendEmail } from '@/mail';
import { subscribe } from '@/newsletter';
import { getBaseUrl } from '@/lib/urls';
import { serverEnv } from '@/env/server';
import { websiteConfig } from '@/config/website';
import { deleteFiles } from '@/storage';
import { DEFAULT_AVATARS_FOLDER } from '@/storage/constants';
import { deletePaymentCustomer } from '@/payment/account-deletion';
import { emailHarmony } from 'better-auth-harmony';
import { admin, apiKey } from 'better-auth/plugins';
import { eq } from 'drizzle-orm';
import { importPKCS8, SignJWT } from 'jose';

const isLocalE2EMode =
  import.meta.env.DEV === true && import.meta.env.MODE === 'e2e';
const emailRegistrationEnabled =
  websiteConfig.auth?.enableCredentialRegistration ?? true;
const googleOAuthEnabled = Boolean(
  websiteConfig.auth?.enableGoogleLogin &&
    serverEnv.GOOGLE_CLIENT_ID &&
    serverEnv.GOOGLE_CLIENT_SECRET
);
const githubOAuthEnabled = Boolean(
  websiteConfig.auth?.enableGitHubLogin &&
    serverEnv.GITHUB_CLIENT_ID &&
    serverEnv.GITHUB_CLIENT_SECRET
);
const appleOAuthEnabled = Boolean(
  websiteConfig.auth?.enableAppleLogin &&
    serverEnv.APPLE_CLIENT_ID &&
    serverEnv.APPLE_TEAM_ID &&
    serverEnv.APPLE_KEY_ID &&
    serverEnv.APPLE_PRIVATE_KEY
);
const trustedSocialProviders = [
  ...(googleOAuthEnabled ? ['google'] : []),
  ...(githubOAuthEnabled ? ['github'] : []),
  ...(appleOAuthEnabled ? ['apple'] : []),
];

/**
 * Better Auth Configuration
 * https://www.better-auth.com/docs/reference/options
 * https://www.better-auth.com/docs/adapters/drizzle
 */
export const auth = betterAuth({
  baseURL: getBaseUrl(),
  appName: websiteConfig.metadata?.name,
  database: drizzleAdapter(getDb(), {
    provider: 'sqlite',
  }),
  session: {
    // https://www.better-auth.com/docs/concepts/session-management#cookie-cache
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60, // Cache duration in seconds
    },
    // https://www.better-auth.com/docs/concepts/session-management#session-expiration
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    // https://www.better-auth.com/docs/concepts/session-management#session-freshness
    // https://www.better-auth.com/docs/concepts/users-accounts#authentication-requirements
    // disable freshness check for user deletion
    freshAge: 0 /* 60 * 60 * 24 */,
  },
  emailAndPassword: {
    // https://discord.com/channels/1300839113142046730/1300839113594769431/1454280549060444393
    enabled: websiteConfig.auth?.enableCredentialLogin ?? false,
    disableSignUp: !emailRegistrationEnabled && !isLocalE2EMode,
    // https://www.better-auth.com/docs/concepts/email#2-require-email-verification
    requireEmailVerification: websiteConfig.mail?.enable === true,
    // https://www.better-auth.com/docs/authentication/email-password#forget-password
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        template: 'forgotPassword',
        context: { url, name: user.name ?? '' },
      });
    },
  },
  emailVerification: {
    // https://www.better-auth.com/docs/concepts/email#auto-signin-after-verification
    autoSignInAfterVerification: true,
    // https://www.better-auth.com/docs/authentication/email-password#require-email-verification
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        template: 'verifyEmail',
        context: { url, name: user.name ?? '' },
      });
    },
    sendOnSignIn: websiteConfig.mail?.enable === true,
  },
  socialProviders: {
    // https://www.better-auth.com/docs/authentication/google
    ...(googleOAuthEnabled
      ? {
          google: {
            clientId: serverEnv.GOOGLE_CLIENT_ID!,
            clientSecret: serverEnv.GOOGLE_CLIENT_SECRET!,
          },
        }
      : {}),
    // https://www.better-auth.com/docs/authentication/github
    ...(githubOAuthEnabled
      ? {
          github: {
            clientId: serverEnv.GITHUB_CLIENT_ID!,
            clientSecret: serverEnv.GITHUB_CLIENT_SECRET!,
          },
        }
      : {}),
    // https://www.better-auth.com/docs/authentication/apple
    ...(appleOAuthEnabled
      ? {
          apple: async () => ({
            clientId: serverEnv.APPLE_CLIENT_ID!,
            clientSecret: await generateAppleClientSecret(),
          }),
        }
      : {}),
  },
  trustedOrigins: appleOAuthEnabled ? ['https://appleid.apple.com'] : undefined,
  account: {
    // https://www.better-auth.com/docs/concepts/users-accounts#account-linking
    accountLinking: {
      enabled: trustedSocialProviders.length > 0,
      trustedProviders: trustedSocialProviders,
    },
  },
  user: {
    // https://www.better-auth.com/docs/concepts/database#extending-core-schema
    additionalFields: {
      customerId: {
        type: 'string',
        required: false,
      },
    },
    // https://www.better-auth.com/docs/concepts/users-accounts#delete-user
    deleteUser: {
      enabled: websiteConfig.auth?.enableDeleteAccount ?? false,
      beforeDelete: async (authUser) => {
        await deleteUserData(authUser.id);
      },
    },
  },
  databaseHooks: {
    // https://www.better-auth.com/docs/concepts/database#database-hooks
    user: {
      create: {
        after: async (user) => {
          await onCreateUser(user);
        },
      },
    },
  },
  plugins: [
    // https://www.better-auth.com/docs/integrations/tanstack
    tanstackStartCookies(),
    // https://www.better-auth.com/docs/plugins/admin
    // support user management, ban/unban user, manage user roles, etc.
    admin({
      // https://www.better-auth.com/docs/plugins/admin#default-ban-reason
      // defaultBanReason: 'Spamming',
      defaultBanExpiresIn: undefined,
      bannedUserMessage:
        'You have been banned from this application. Please contact support if you believe this is an error.',
    }),
    // https://www.better-auth.com/docs/plugins/api-key
    // support API key management for user authentication
    apiKey({
      rateLimit: {
        // /api/v1/convert enforces the Studio quota per account in D1 so
        // creating multiple keys cannot multiply the daily allowance.
        enabled: false,
      },
    }),
    // https://github.com/gekorm/better-auth-harmony
    // email normalization and validation to prevent duplicate registrations
    emailHarmony({
      // Don't allow login with any version of the unnormalized email address
      // e.g., user signed up with johndoe@googlemail.com can't login with john.doe@gmail.com
      // e.g., user signed up with johndoe@googlemail.com can't login with johndoe+abc@gmail.com
      allowNormalizedSignin: false,
    }),
  ],
  onAPIError: {
    // https://www.better-auth.com/docs/reference/options#onapierror
    errorURL: '/auth/error',
    onError: (error, _ctx) => {
      console.error('auth error:', error);
    },
  },
});

async function generateAppleClientSecret() {
  const privateKey = await importPKCS8(
    serverEnv.APPLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    'ES256'
  );
  const now = Math.floor(Date.now() / 1000);

  return new SignJWT({})
    .setProtectedHeader({ alg: 'ES256', kid: serverEnv.APPLE_KEY_ID! })
    .setIssuer(serverEnv.APPLE_TEAM_ID!)
    .setSubject(serverEnv.APPLE_CLIENT_ID!)
    .setAudience('https://appleid.apple.com')
    .setIssuedAt(now)
    .setExpirationTime(now + 180 * 24 * 60 * 60)
    .sign(privateKey);
}

/**
 * Runs after a new user is created. Auto-subscribes to newsletter when enabled.
 */
async function onCreateUser(user: User) {
  const newsletterConfig = websiteConfig.newsletter;
  if (
    !user.email ||
    !newsletterConfig?.enable ||
    !newsletterConfig.autoSubscribeAfterSignUp
  ) {
    return;
  }

  try {
    const subscribed = await subscribe(user.email);
    if (!subscribed) {
      console.error(`onCreateUser, user ${user.email} failed to subscribe`);
    } else {
      console.log(`onCreateUser, user ${user.email} subscribed to newsletter`);
    }
  } catch (error) {
    console.error('onCreateUser, newsletter subscription error:', error);
  }
}

async function deleteUserData(userId: string) {
  const db = getDb();
  const [account] = await db
    .select({ customerId: user.customerId, image: user.image })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);
  const files = await db
    .select({ r2Key: userFiles.r2Key })
    .from(userFiles)
    .where(eq(userFiles.userId, userId));

  await deletePaymentCustomer(account?.customerId);
  const avatarKey = getUserAvatarKey(account?.image, userId);
  await deleteFiles(
    files
      .map((file) => file.r2Key)
      .concat(avatarKey === null ? [] : [avatarKey])
  );
}

function getUserAvatarKey(image: string | null | undefined, userId: string) {
  if (!image) return null;
  try {
    const key = new URL(image, getBaseUrl()).searchParams.get('key');
    const expectedKey = `${DEFAULT_AVATARS_FOLDER}/${userId}/avatar`;
    return key === expectedKey ? key : null;
  } catch {
    return null;
  }
}
