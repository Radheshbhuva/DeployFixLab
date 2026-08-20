import app from './app';
import { disconnectDatabase } from './config/database';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

const server = app.listen(PORT, () => {
  console.log(`[Server] DeployFix Backend listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Graceful Shutdown Handler
const gracefulShutdown = (signal: string) => {
  console.log(`[Server] Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    console.log('[Server] HTTP server closed.');
    await disconnectDatabase();
    console.log('[Server] Database connections closed. Exiting process.');
    process.exit(0);
  });

  // Force exit if graceful shutdown takes longer than 10s
  setTimeout(() => {
    console.error('[Server] Could not close connections in time, forcefully shutting down.');
    process.exit(1);
  }, 10000);
};

// Listen for OS termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Unhandled Rejections and Exceptions
process.on('unhandledRejection', (reason: Error) => {
  console.error('[Server] UNHANDLED REJECTION! Shutting down...');
  console.error(reason?.name, reason?.message, reason?.stack);
  gracefulShutdown('UNHANDLED_REJECTION');
});

process.on('uncaughtException', (err: Error) => {
  console.error('[Server] UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message, err.stack);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

