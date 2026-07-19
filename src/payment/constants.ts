/**
 * Polling interval for payment completion (ms)
 */
export const PAYMENT_POLL_INTERVAL = 2000;

/**
 * Max polling time for payment completion (ms)
 */
export const PAYMENT_MAX_POLL_TIME = 60000;

/**
 * Briefly retry when invoice.paid races checkout.session.completed.
 * Checkout completion records the initial paid state itself, so later Stripe
 * retries can reconcile the invoice without holding a webhook open for a minute.
 */
export const PAYMENT_RECORD_RETRY_ATTEMPTS = 3;

/**
 * Retry delay between attempts (ms)
 */
export const PAYMENT_RECORD_RETRY_DELAY = 500;
