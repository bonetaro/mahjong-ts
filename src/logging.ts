import { createLogger, transports, format } from "winston";

export const logger = createLogger({
  level: "info",
  // level: "debug",
  transports: [new transports.Console()],
  format: format.combine(
    format.colorize(),
    format.splat(),
    format.metadata(),
    format.timestamp(),
    format.printf(({ timestamp, level, message, metadata }) => {
      if (Object.keys(metadata).length > 0 && level === "debug") {
        return `[${timestamp}] ${level}: ${message} ${JSON.stringify(
          metadata
        )}`;
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
