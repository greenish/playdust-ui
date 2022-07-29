import getPDEnv from './getPDEnv';
import ReactGA from 'react-ga4';

function logger(msg: string, error: Error | unknown, componentStack?: string) {

  const newError =
    error instanceof Error ? error : new Error(JSON.stringify(error));
  const pdEnv = getPDEnv();

  if (pdEnv === 'production') {
    const category = '';
    const action = '';
    const label = '';
    ReactGA.event({
      category,
      action,
      label,
    });
  } else {
    console.error(msg, newError, componentStack);
  }
}

export default logger;
