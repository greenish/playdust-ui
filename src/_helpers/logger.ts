import { Logger } from 'aws-cloudwatch-log-browser';
 
const config = { 
    logGroupName: 'YourGroupName', 
    logStreamName: 'YourLogStream', 
    region: 'ap-southeast-2', 
    accessKeyId: 'BLABLABLABLABLABLA', 
    secretAccessKey: 'some-very-long-secret', 
    uploadFreq: 10000, 	// Optional. Send logs to AWS LogStream in batches after 10 seconds intervals.
    local: false 		// Optional. If set to true, the log will fall back to the standard 'console.log'.
};
 
const logger = new Logger(config);

export default logger;