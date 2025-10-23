import { Request, Response, NextFunction } from 'express';
import { logger } from './logger.js';
import { AppError } from '../utils/AppError';

// Custom error interface
export interface CustomError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: string;
  keyValue?: any;
  errors?: any;
}

// Global error handler
export const globalErrorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new AppError(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === '11000') {
    const value = err.keyValue ? Object.values(err.keyValue)[0] : 'unknown';
    const message = `Duplicate field value: ${value}. Please use another value.`;
    error = new AppError(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = err.errors ? Object.values(err.errors).map((val: any) => val.message) : [];
    const message = `Invalid input data: ${errors.join('. ')}`;
    error = new AppError(message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token. Please log in again.';
    error = new AppError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Your token has expired. Please log in again.';
    error = new AppError(message, 401);
  }

  // Firebase auth errors
  if (err.message.includes('Firebase')) {
    const message = 'Authentication failed. Please try again.';
    error = new AppError(message, 401);
  }

  // Database connection errors
  if (err.message.includes('ECONNREFUSED')) {
    const message = 'Database connection failed. Please try again later.';
    error = new AppError(message, 503);
  }

  // Rate limiting errors
  if (err.message.includes('Too many requests')) {
    const message = 'Too many requests. Please try again later.';
    error = new AppError(message, 429);
  }

  // Send error response
  sendErrorResponse(error, req, res);
};

// Send error response
const sendErrorResponse = (err: AppError | CustomError, req: Request, res: Response) => {
  // Check if response has already been sent
  if (res.headersSent) {
    return;
  }

  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  } else {
    // Programming or other unknown error: don't leak error details
    logger.error('Programming error:', err);

    res.status(500).json({
      success: false,
      error: process.env.NODE_ENV === 'production' 
        ? 'Something went wrong!' 
        : err.message
    });
  }
};

// Handle unhandled promise rejections
export const handleUnhandledRejection = () => {
  process.on('unhandledRejection', (err: Error) => {
    logger.error('Unhandled Promise Rejection:', err);
    process.exit(1);
  });
};

// Handle uncaught exceptions
export const handleUncaughtException = () => {
  process.on('uncaughtException', (err: Error) => {
    logger.error('Uncaught Exception:', err);
    process.exit(1);
  });
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Not found - ${req.originalUrl}`, 404);
  next(error);
};

// Validation error handler
export const handleValidationError = (errors: any[]) => {
  const message = errors.map(error => error.msg).join('. ');
  return new AppError(message, 400);
};

// Database error handler
export const handleDatabaseError = (err: any) => {
  if (err.code === '23505') { // PostgreSQL unique violation
    return new AppError('Duplicate entry. Please use a different value.', 400);
  }
  if (err.code === '23503') { // PostgreSQL foreign key violation
    return new AppError('Referenced resource not found.', 400);
  }
  if (err.code === '23502') { // PostgreSQL not null violation
    return new AppError('Required field is missing.', 400);
  }
  return new AppError('Database operation failed.', 500);
};

// Network error handler
export const handleNetworkError = (err: any) => {
  if (err.code === 'ECONNREFUSED') {
    return new AppError('Service unavailable. Please try again later.', 503);
  }
  if (err.code === 'ETIMEDOUT') {
    return new AppError('Request timeout. Please try again.', 408);
  }
  return new AppError('Network error occurred.', 500);
};

// File upload error handler
export const handleFileUploadError = (err: any) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return new AppError('File too large. Maximum size is 5MB.', 400);
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return new AppError('Unexpected file field.', 400);
  }
  return new AppError('File upload failed.', 500);
};
