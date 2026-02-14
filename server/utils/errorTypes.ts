export function create400Error (message: string) {
  return createError({
    statusCode: 400,
    message: message,
    cause: 'Request Body is invalid.'
  });
}

export function create500Error () {
  return createError({
    statusCode: 500,
    message: 'Ocurrió un error inesperado en la aplicación. Por favor, comunícate con un asesor para solucionarlo.',
  });
}

export function createBUGError () {
  return createError({
    statusCode: 400,
    message: 'La operación no pudo ser completada. Por favor, comuníquese con nosotros para solucionarlo.',
    fatal: true
  });
}
