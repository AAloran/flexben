let errorHelpers = {
    logErrorsToConsole: function (err, req, res, next) {
        console.error("*".repeat(80));
        console.error("Log Entry: " + err);
        console.error("Log Entry: " + err.stack);
        console.error("*".repeat(80));
        next(err)
    },
    clientErrorHandler: function (err, req, res, next) {
        if (req.xhr) {
            res.status(500).json({
                "status": 500,
                "statusText": "Internal Server Error",
                "message": "XMLHttpRequest error",
                "error": {
                    "errno": 0,
                    "call": "XMLHttpRequest Call",
                    "code": "INTERNAL_SERVER_ERROR",
                    "message": "XMLHttpRequest Error"
                }
            });
        } else {
            next(err);
        }
    },
    errorHandler: function (err, req, res, next) {
        res.status(500).json(errorHelpers.errorBuilder(err));
    },
    throwError: async (error) => {
        throw new Error (error)
    }, 
    errorBuilder: function (err) {
        return {
            "status": 500,
            "statusText": "Internal Server Error",
            "message": err.message,
            "error": {
                "errno": err.errno,
                "call": err.syscall,
                "code": err.code,
            }
        };
    }
};

module.exports = errorHelpers;