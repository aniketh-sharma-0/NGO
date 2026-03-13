const errorHandler = (err, req, res, next) => {
    // Determine the status code. If it's still 200 but an error reached here, force it to 500
    const statusCode = res.statusCode ? res.statusCode : 500;

    // Log the actual error internally for debugging (always visible on the server)
    console.error(`[ERROR Handler] Context: ${req.method} ${req.originalUrl}`);
    console.error(err);

    // Development Mode Response: Show exactly what went wrong
    if (process.env.NODE_ENV === 'development') {
        res.status(statusCode).json({
            message: err.message,
            stack: err.stack,
        });
    } else {
        // Hide sensitive serve data details
        // Only return the message if it's a known, safe application logic error (e.g. "User not found")
        // If it's a deep system crash (like DB failure), return a generic message.
        const safeMessage = statusCode >= 500 ? 'Internal Server Error' : err.message;

        res.status(statusCode).json({
            message: safeMessage,
            // Stack trace is explicitly excluded in production
        });
    }
};

module.exports = {
    errorHandler,
};
