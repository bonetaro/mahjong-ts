import { createLogger, transports, format } from "winston";

export const logger = createLogger({
  level: "info",
  // level: "debug",
  transports: [
    new transports.Console(),
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
  ],
  format: format.combine(
    format.colorize(),
    format.splat(),
    format.metadata(),
    format.timestamp(),
    format.printf(({ timestamp, level, message, metadata }) => {
      if (Object.keys(metadata).length > 0) {
        return `[${timestamp}] ${level}: ${message} ${JSON.stringify(metadata)}`;
      } else {
        return `[${timestamp}] ${level}: ${message}`;
      }
    })
  ),
});

export function LogEvent(text: string): void {
  logger.info("--------------------------------------------------------");
  logger.info(text);
  logger.info("--------------------------------------------------------");
}
