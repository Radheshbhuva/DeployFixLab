import app from './app';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Graceful Shutdown Handler
const shutdown = (signal: string) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });

  // Force exit if server close takes too long
  setTimeout(() => {
    console.error('Forcefully shutting down because graceful shutdown timed out.');
    process.exit(1);
  }, 10000);
};

// Listen for termination signals
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Unhandled Rejections and Exceptions
process.on('unhandledRejection', (reason: Error) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(reason.name, reason.message, reason.stack);
  shutdown('UNHANDLED_REJECTION');
});

process.on('uncaughtException', (err: Error) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message, err.stack);
  shutdown('UNCAUGHT_EXCEPTION');
});
