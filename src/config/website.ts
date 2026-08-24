import { getMessageList } from '@/lib/locale';
import { m } from '@/locale/paraglide/messages';
import { clientEnv } from '@/env/client';
import type { WebsiteConfig } from '../types';

// Payment provider controlled by env var: 'stripe' | 'creem' | '' (empty means disabled)
const paymentProvider = clientEnv.VITE_PAYMENT_PROVIDER;
const isPaymentEnabled = paymentProvider !== '';
const isCreemPayment = paymentProvider === 'creem';
// Resolve price/product IDs based on the active payment provider
const priceIds = isPaymentEnabled
  ? {
      proMonthly: isCreemPayment
        ? (clientEnv.VITE_CREEM_PRODUCT_PRO_MONTHLY ?? '')
        : (clientEnv.VITE_STRIPE_PRICE_PRO_MONTHLY ?? ''),
      proYearly: isCreemPayment
        ? (clientEnv.VITE_CREEM_PRODUCT_PRO_YEARLY ?? '')
        : (clientEnv.VITE_STRIPE_PRICE_PRO_YEARLY ?? ''),
      studioMonthly: isCreemPayment
        ? (clientEnv.VITE_CREEM_PRODUCT_STUDIO_MONTHLY ?? '')
        : (clientEnv.VITE_STRIPE_PRICE_STUDIO_MONTHLY ?? ''),
      studioYearly: isCreemPayment
        ? (clientEnv.VITE_CREEM_PRODUCT_STUDIO_YEARLY ?? '')
        : (clientEnv.VITE_STRIPE_PRICE_STUDIO_YEARLY ?? ''),
      lifetime: isCreemPayment
        ? (clientEnv.VITE_CREEM_PRODUCT_LIFETIME ?? '')
        : (clientEnv.VITE_STRIPE_PRICE_LIFETIME ?? ''),
    }
  : {
      proMonthly: '',
      proYearly: '',
      studioMonthly: '',
      studioYearly: '',
      lifetime: '',
    };

/**
 * Website config
 */
export const websiteConfig: WebsiteConfig = {
  ui: {
    mode: {
      defaultMode: 'light',
      enableSwitch: false,
    },
  },
  metadata: {
    name: 'SubtitleOps',
    title: 'Subtitle Converter for Real Workflows',
    description:
      'Convert, extract, create, and fix subtitle files with clear results and a path from one-file tasks to repeat workflows.',
    images: {
      ogImage: '/og/subtitleops-tools.png',
      logoLight: '/icon.svg',
      logoDark: '/icon.svg',
    },
  },
  social: {},
  auth: {
    enable: true,
    enableGoogleLogin: true,
    enableGitHubLogin: true,
    enableAppleLogin: false,
    enableCredentialLogin: true,
    enableCredentialRegistration: false,
    enableDeleteAccount: true,
  },
  blog: {
    enable: true,
    paginationSize: 6,
  },
  mail: {
    enable: clientEnv.VITE_MAIL_ENABLED,
    provider: 'resend',
    fromEmail: 'SubtitleOps <support@subtitleops.com>',
    supportEmail: 'SubtitleOps <support@subtitleops.com>',
  },
  newsletter: {
    enable: false,
    provider: 'resend',
    autoSubscribeAfterSignUp: true,
  },
  notification: {
    enable: false,
    provider: 'discord',
  },
  cache: {
    enable: false,
    provider: 'kv',
  },
  storage: {
    enable: true,
    provider: 'r2',
    maxFileSize: 25 * 1024 * 1024,
    allowedTypes: ['.srt', '.ass', '.ssa', '.vtt', '.sbv', '.txt', '.zip'],
    userFilesFolder: 'subtitle-files',
  },
  payment: {
    enable: isPaymentEnabled,
    provider: isPaymentEnabled ? paymentProvider : undefined,
    price: {
      plans: {
        free: {
          id: 'free',
          prices: [],
          isFree: true,
          isLifetime: false,
          get name() {
            return m.pricing_plans_free_name();
          },
          get description() {
            return m.pricing_plans_free_description();
          },
          get features() {
            return [...getMessageList(m.pricing_plans_free_features())];
          },
          get limits() {
            return [...getMessageList(m.pricing_plans_free_limits())];
          },
        },
        pro: {
          id: 'pro',
          prices: [
            {
              type: 'subscription',
              priceId: priceIds.proMonthly,
              amount: 999,
              currency: 'USD',
              interval: 'month',
            },
            {
              type: 'subscription',
              priceId: priceIds.proYearly,
              amount: 7900,
              currency: 'USD',
              interval: 'year',
            },
          ],
          isFree: false,
          isLifetime: false,
          popular: true,
          get name() {
            return m.pricing_plans_pro_name();
          },
          get description() {
            return m.pricing_plans_pro_description();
          },
          get features() {
            return [...getMessageList(m.pricing_plans_pro_features())];
          },
          get limits() {
            return [...getMessageList(m.pricing_plans_pro_limits())];
          },
        },
        studio: {
          id: 'studio',
          prices: [
            {
              type: 'subscription',
              priceId: priceIds.studioMonthly,
              amount: 2499,
              currency: 'USD',
              interval: 'month',
            },
            {
              type: 'subscription',
              priceId: priceIds.studioYearly,
              amount: 19900,
              currency: 'USD',
              interval: 'year',
            },
          ],
          isFree: false,
          isLifetime: false,
          get name() {
            return m.pricing_plans_studio_name();
          },
          get description() {
            return m.pricing_plans_studio_description();
          },
          get features() {
            return [...getMessageList(m.pricing_plans_studio_features())];
          },
          get limits() {
            return [...getMessageList(m.pricing_plans_studio_limits())];
          },
        },
        lifetime: {
          id: 'lifetime',
          prices: [
            {
              type: 'one_time',
              priceId: priceIds.lifetime,
              amount: 4900,
              currency: 'USD',
            },
          ],
          isFree: false,
          isLifetime: true,
          disabled: true,
          name: 'Lifetime',
          description: 'Reserved one-time purchase support.',
          features: [],
          limits: [],
        },
      },
    },
  },
};
