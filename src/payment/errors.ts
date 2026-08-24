export class PaymentWebhookRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PaymentWebhookRequestError';
  }
}
