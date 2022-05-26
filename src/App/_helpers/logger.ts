function logger(msg: string, error: Error, componentStack?: string) {
  if (process.env.VERCEL_ENV === 'production') {
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
