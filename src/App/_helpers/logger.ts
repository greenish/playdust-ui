import { datadogRum } from '@datadog/browser-rum';
import getPDEnv from './getPDEnv';

function logger(msg: string, error: Error | unknown, componentStack?: string) {
  const newError =
    error instanceof Error ? error : new Error(JSON.stringify(error));
  const pdEnv = getPDEnv();
  if (pdEnv === 'production') {
    datadogRum.addError(newError, {
      pageStatus: pdEnv,
      msg,
    });
  } else {
    console.error(msg, newError, componentStack);
  }
}

export default logger;
