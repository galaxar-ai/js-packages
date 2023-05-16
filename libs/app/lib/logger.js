export const LOG_UNKNOWN = 'unknown';
export const LOG_DEBUG = 'debug';
export const LOG_VERBOSE = 'verbose';
export const LOG_INFO = 'info';
export const LOG_WARNING = 'warning';
export const LOG_ERROR = 'error';
export const LOG_DISABLE = 'disable';

export const TRACE = -1;
export const DEBUG = 1;
export const VERBOSE = 2;
export const INFO = 3;
export const WARNING = 4;
export const ERROR = 5;

let logLevel = INFO;

const mapLogLevels = {
    trace: TRACE,
    debug: DEBUG,
    verbose: VERBOSE,
    info: INFO,
    warning: WARNING,
    warn: WARNING,
    error: ERROR,
    disable: ERROR + 1,
};

const levelText = [
    LOG_UNKNOWN,
    LOG_DEBUG,
    LOG_VERBOSE,
    LOG_INFO,
    LOG_WARNING,
    LOG_ERROR,
    LOG_DISABLE,
];

export const getLogLevel = () => logLevel;

export const setLogLevel = (level) => (logLevel = mapLogLevels[level]);

export const makeLogger =
    (logger) =>
    (level, ...args) => {
        const enabledLogLevel = mapLogLevels[level] >= logLevel ? mapLogLevels[level] : 0;

        if (enabledLogLevel !== 0) {
            let _args = args.length === 1 && typeof args[0] === 'function' ? args[0]() : args;
            Array.isArray(_args) || (_args = [_args]);

            logger(enabledLogLevel, args);
        }
    };

export const consoleLogger = (level, args) =>
    (level === ERROR
        ? console.error
        : level === WARNING
        ? console.warn
        : level === TRACE
        ? console.trace
        : console.log)(`[${levelText[level]}]`, ...args);
