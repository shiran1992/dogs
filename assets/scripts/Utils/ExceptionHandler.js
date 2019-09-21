const Debugger = require("Debugger")

function onException(errorMessage, file, line, message, error) {
    let exception = {};
    exception.errorMessage = errorMessage;
    exception.file = file;
    exception.line = line;
    exception.message = message;
    exception.error = error;

    if (window.exception != JSON.stringify(exception)) {
        window.exception = JSON.stringify(exception);
        Debugger.log(exception);
    }
}

function setupExceptionHandler() {
    if (cc.sys.isNative) {
        window.__errorHandler = onException;
    } else if (cc.sys.isBrowser) {
        window.onerror = onException;
    }
}

module.exports = setupExceptionHandler;