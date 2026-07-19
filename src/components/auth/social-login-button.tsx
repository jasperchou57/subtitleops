import { m } from '@/locale/paraglide/messages';
import { useState } from 'react';
import { DividerWithText } from '@/components/auth/divider-with-text';
import { Button } from '@/components/ui/button';
import { websiteConfig } from '@/config/website';
import { authClient } from '@/auth/client';
import { resolveAuthCallbackPath } from '@/lib/auth-callback';
import { DEFAULT_LOGIN_REDIRECT, Routes } from '@/lib/routes';
import { getPathWithLocale } from '@/lib/urls';
import {
  IconBrandAppleFilled,
  IconBrandGithubFilled,
  IconBrandGoogleFilled,
  IconLoader2,
} from '@tabler/icons-react';

type SocialProvider = 'google' | 'github' | 'apple';

const socialProviders = [
  {
    id: 'google',
    enabled: websiteConfig.auth?.enableGoogleLogin === true,
    signInLabel: () => m.auth_social_sign_in_with_google(),
    signUpLabel: () => m.auth_social_sign_up_with_google(),
    Icon: IconBrandGoogleFilled,
  },
  {
    id: 'github',
    enabled: websiteConfig.auth?.enableGitHubLogin === true,
    signInLabel: () => m.auth_social_sign_in_with_github(),
    signUpLabel: () => m.auth_social_sign_up_with_github(),
    Icon: IconBrandGithubFilled,
  },
  {
    id: 'apple',
    enabled: websiteConfig.auth?.enableAppleLogin === true,
    signInLabel: () => m.auth_social_sign_in_with_apple(),
    signUpLabel: () => m.auth_social_sign_up_with_apple(),
    Icon: IconBrandAppleFilled,
  },
] satisfies Array<{
  id: SocialProvider;
  enabled: boolean;
  signInLabel: () => string;
  signUpLabel: () => string;
  Icon: typeof IconBrandGoogleFilled;
}>;
interface SocialLoginButtonProps {
  callbackUrl?: string;
  showDivider?: boolean;
  mode?: 'sign-in' | 'sign-up';
}
export function SocialLoginButton({
  callbackUrl: propCallbackUrl,
  showDivider = true,
  mode = 'sign-in',
}: SocialLoginButtonProps) {
  const paramCallbackUrl =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('callbackUrl')
      : null;
  const defaultCallbackUrl = getPathWithLocale(DEFAULT_LOGIN_REDIRECT);
  const callbackUrl = resolveAuthCallbackPath(
    [propCallbackUrl, paramCallbackUrl],
    defaultCallbackUrl
  );
  const [isLoading, setIsLoading] = useState<SocialProvider | null>(null);
  const enabledProviders = socialProviders.filter(
    (provider) => provider.enabled
  );
  if (enabledProviders.length === 0) {
    return null;
  }
  const onClick = async (provider: SocialProvider) => {
    await authClient.signIn.social(
      {
        provider,
        callbackURL: callbackUrl,
        errorCallbackURL: getPathWithLocale(Routes.AuthError),
      },
      {
        onRequest: () => setIsLoading(provider),
        onResponse: () => setIsLoading(null),
        onSuccess: () => setIsLoading(null),
        onError: () => setIsLoading(null),
      }
    );
  };
  return (
    <div className="w-full flex flex-col gap-4">
      {showDivider && <DividerWithText text={m.auth_social_or()} />}
      {enabledProviders.map(({ id, signInLabel, signUpLabel, Icon }) => (
        <Button
          key={id}
          type="button"
          size="lg"
          className="w-full"
          variant="outline"
          onClick={() => onClick(id)}
          disabled={isLoading !== null}
        >
          {isLoading === id ? (
            <IconLoader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Icon className="mr-2 size-4" />
          )}
          <span>{mode === 'sign-up' ? signUpLabel() : signInLabel()}</span>
        </Button>
      ))}
    </div>
  );
}
