import getPDEnv from './getPDEnv';

function logger(msg: string, error: Error, componentStack?: string) {
  if (getPDEnv() === 'production') {
    ineum('reportError', error, {
      componentStack,
      meta: {
        reason: msg,
      },
    });
  } else {
    console.error(msg, error, componentStack);
  }
}

export default logger;
