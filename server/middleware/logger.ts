import morgan from 'morgan';

const logger = morgan('dev');

export default defineEventHandler((event) => {
  return new Promise<void>((resolve) => {
    logger(event.node.req, event.node.res, () => {
      resolve();
    });
  });
});
