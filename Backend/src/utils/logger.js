const winston = require("winston");
const config = require("../config/environment");

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

const transports = [
  // Console transport
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      format,
    ),
  }),

  // File transports
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
    format,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),

  new winston.transports.File({
    filename: "logs/all.log",
    format,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
];

const logger = winston.createLogger({
  level: config.LOG_LEVEL || "debug",
  levels,
  format,
  transports,
  exceptionHandlers: [
    new winston.transports.File({
      filename: "logs/exceptions.log",
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: "logs/rejections.log",
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

module.exports = logger;
