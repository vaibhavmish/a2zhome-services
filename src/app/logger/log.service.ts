import { GLOBAL_CONSTANTS } from './../global-constants';
// Declare the console as an ambient value so that TypeScript doesn't complain.
declare var console: any;

// Import the application components and services.
import { ILogger } from './default-log.service';


// I log values to the ambient console object.
export class ConsoleLogService implements ILogger {

    public assert(...args: any[]): void {
        (GLOBAL_CONSTANTS.showLog==='true' && console && console.assert) && console.assert(...args);
    }

    public error(...args: any[]): void {
        (GLOBAL_CONSTANTS.showLog==='true' && console && console.error) && console.error(...args);
    }

    public group(...args: any[]): void {
        (GLOBAL_CONSTANTS.showLog==='true' && console && console.group) && console.group(...args);
    }

    public groupEnd(...args: any[]): void {
        (GLOBAL_CONSTANTS.showLog==='true' && console && console.groupEnd) && console.groupEnd(...args);
    }

    public info(...args: any[]): void {
        (GLOBAL_CONSTANTS.showLog==='true' && console && console.info) && console.info(...args);
    }

    public log(...args: any[]): void {
        (GLOBAL_CONSTANTS.showLog==='true' && console && console.log) && console.log(...args);
    }

    public warn(...args: any[]): void {
        (GLOBAL_CONSTANTS.showLog==='true' && console && console.warn) && console.warn(...args);
    }

}

// ref: https://www.bennadel.com/blog/3129-implementing-a-log-inspired-logging-service-in-angular-2-rc-4.htm

