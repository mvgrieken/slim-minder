import { createLogger, format, transports, Logger } from 'winston';

// Custom format voor gestructureerde logging
const structuredFormat = format.combine(
  format.timestamp(),
  format.errors({ stack: true }),
  format.json(),
  format.printf(({ timestamp, level, message, ...meta }) => {
    const logEntry: any = {
      timestamp,
      level,
      message,
      ...meta
    };
    
    // Verwijder PII uit logs
    if (meta.user && typeof meta.user === 'object' && 'id' in meta.user) {
      logEntry.user = {
        id: meta.user.id,
        // Verwijder email, naam, etc.
      };
    }
    
    return JSON.stringify(logEntry);
  })
);

// Development format voor leesbare logs
const developmentFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta, null, 2)}`;
    }
    
    return log;
  })
);

// Logger configuratie
const createAppLogger = (): Logger => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: isDevelopment ? developmentFormat : structuredFormat,
    defaultMeta: {
      service: 'slim-minder-api',
      version: process.env.npm_package_version || '1.0.0'
    },
    transports: [
      // Console transport
      new transports.Console({
        level: isDevelopment ? 'debug' : 'info'
      }),
      
      // File transport voor errors
      new transports.File({
        filename: 'logs/error.log',
        level: 'error',
        maxsize: 5242880, // 5MB
        maxFiles: 5
      }),
      
      // File transport voor alle logs
      new transports.File({
        filename: 'logs/combined.log',
        maxsize: 5242880, // 5MB
        maxFiles: 5
      })
    ]
  });

  // Handle uncaught exceptions
  logger.exceptions.handle(
    new transports.File({ filename: 'logs/exceptions.log' })
  );

  // Handle unhandled promise rejections
  logger.rejections.handle(
    new transports.File({ filename: 'logs/rejections.log' })
  );

  return logger;
};

// Logger instance
export const logger = createAppLogger();

// Helper functies voor consistente logging
export const logRequest = (req: any, res: any, responseTime: number) => {
  const logData = {
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    responseTime: `${responseTime}ms`,
    userAgent: req.headers['user-agent'],
    ip: req.ip || req.connection.remoteAddress,
    userId: req.user?.id
  };

  if (res.statusCode >= 400) {
    logger.warn('HTTP Request', logData);
  } else {
    logger.info('HTTP Request', logData);
  }
};

export const logError = (error: Error, context?: any) => {
  logger.error('Application Error', {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack
    },
    context
  });
};

export const logSecurityEvent = (event: string, details: any) => {
  logger.warn('Security Event', {
    event,
    details,
    timestamp: new Date().toISOString()
  });
};

export const logDatabaseQuery = (query: string, duration: number, params?: any) => {
  if (duration > 1000) { // Log slow queries (>1s)
    logger.warn('Slow Database Query', {
      query,
      duration: `${duration}ms`,
      params
    });
  } else if (process.env.NODE_ENV === 'development') {
    logger.debug('Database Query', {
      query,
      duration: `${duration}ms`
    });
  }
};

// Middleware voor request logging
export const requestLogger = (req: any, res: any, next: any) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logRequest(req, res, duration);
  });
  
  next();
};

// Error logging middleware
export const errorLogger = (error: Error, req: any, res: any, next: any) => {
  logError(error, {
    method: req.method,
    url: req.url,
    userId: req.user?.id
  });
  
  next(error);
};
