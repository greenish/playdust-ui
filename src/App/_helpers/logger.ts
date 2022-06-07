import getPDEnv from './getPDEnv';

function logger(msg: string, error: Error | unknown, componentStack?: string) {
  const newError =
    error instanceof Error ? error : new Error(JSON.stringify(error));

  if (getPDEnv() === 'production') {
    ineum('reportError', newError, {
      componentStack,
      meta: {
        reason: msg,
      },
    });
  } else {
    console.error(msg, newError, componentStack);
  }
}

export default logger;
