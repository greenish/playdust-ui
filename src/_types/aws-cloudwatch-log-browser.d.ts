declare module 'aws-cloudwatch-log-browser' {
  export type LoggerConfig = {
    logGroupName: string;
    logStreamName: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    uploadFreq: number;
    local: boolean;
  };

  declare class Logger {
    constructor(config: LoggerConfig);
    log: typeof console.log;
  }

  export = {
    Logger,
  };
}
