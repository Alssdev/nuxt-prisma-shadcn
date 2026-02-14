import type { EventHandler, EventHandlerRequest, H3Event } from 'h3';

/**
 * Wraps a Nitro event handler with error monitoring.
 * - create400Error: re-thrown as-is, no notification.
 * - createBUGError (fatal): re-thrown as-is, sends notification.
 * - create500Error / unexpected errors: sends notification, throws create500Error.
 */
export default function defineWrappedHandler<T extends EventHandlerRequest, D>(
  handler: (event: H3Event<T>) => D | Promise<D>,
): EventHandler<T, D> {
  return defineEventHandler<T>(async (event) => {
    try {
      return await handler(event);
    } catch (error: unknown) {
      if (isClientError(error)) {
        throw error;
      }

      await notifyError(event, error);

      if (isFatalError(error)) {
        throw error;
      }

      throw create500Error();
    }
  });
}

function isH3Error(error: unknown): error is { statusCode: number; fatal?: boolean } {
  return error !== null
    && typeof error === 'object'
    && 'statusCode' in error
    && typeof (error as { statusCode: unknown }).statusCode === 'number';
}

function isClientError(error: unknown): boolean {
  return isH3Error(error) && error.statusCode >= 400 && error.statusCode < 500 && !error.fatal;
}

function isFatalError(error: unknown): boolean {
  return isH3Error(error) && !!error.fatal;
}

async function notifyError(event: H3Event, error: unknown): Promise<void> {
  const method = event.method;
  const path = getRequestURL(event).pathname;
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack ?? '' : '';

  const subject = `[Error] ${method} ${path}`;
  const bodyHTML = `
    <h2>Unhandled Server Error</h2>
    <p><strong>Route:</strong> ${method} ${path}</p>
    <p><strong>Time:</strong> ${new Date().toISOString()}</p>
    <p><strong>Message:</strong> ${message}</p>
    <pre>${stack}</pre>
  `;

  const { errorNotificationEmail } = useRuntimeConfig();

  if (!errorNotificationEmail) {
    console.warn('[defineWrappedHandler] Missing errorNotificationEmail in runtimeConfig. Skipping notification.');
    return;
  }

  try {
    await sendEmail({
      emailTo: errorNotificationEmail,
      subject,
      bodyHTML,
    });
  } catch (emailError) {
    console.error('[defineWrappedHandler] Failed to send error notification email:', emailError);
  }
}
