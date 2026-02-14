import type { EventHandler, EventHandlerRequest, H3Event } from 'h3';

/**
 * Wraps a Nitro event handler with error monitoring.
 * Client errors (4xx) are re-thrown as-is.
 * Unexpected errors trigger a notification email and are re-thrown.
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
      throw error;
    }
  });
}

function isClientError(error: unknown): boolean {
  if (
    error !== null
    && typeof error === 'object'
    && 'statusCode' in error
    && typeof (error as { statusCode: unknown }).statusCode === 'number'
  ) {
    const code = (error as { statusCode: number }).statusCode;
    return code >= 400 && code < 500;
  }
  return false;
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
