import moment from "moment";
import * as winston from "winston";

class Logger {
  public consoleLogger: winston.Logger;
  public fileLogger: winston.Logger;

  constructor() {
    this.consoleLogger = this.createConsoleLogger();
    this.fileLogger = this.createFileLogger();
  }

  set silent(value: boolean) {
    this.consoleLogger.silent = value;
    this.fileLogger.silent = value;
  }

  private log = (level: string, message: any, meta?: any): void => {
    this.consoleLogger.log(level, message, meta);
    this.fileLogger.log(level, message, meta);
  };

  debug = (message: any, meta?: any): void => {
    this.log("debug", message, meta);
  };

  info = (message: any, meta?: any): void => {
    this.log("info", message, meta);
  };

  error = (message: any, meta?: any): void => {
    this.log("error", message, meta);
  };

  createFileLogger = (): winston.Logger => {
    return winston.createLogger({
      transports: [
        new winston.transports.File({ dirname: "logs", filename: "error.log", level: "error" }),
        new winston.transports.File({ dirname: "logs", filename: "combined.log" }),
      ],
      format: winston.format.combine(
        winston.format.printf((info: any): string => {
          // 引数を展開する
          const {
            level, // デフォルトで level と message が渡る
            message,
            timestamp, // format.combine() で format.timestamp() 指定されている
            ...etc // その他の内容は JSON で表示する
          } = info;

          return (
            `[${moment(timestamp).format("YYYY-MM-DD HH:mm:SS")}] ${level}: ${message}` +
            `${etc && Object.keys(etc).length ? "\n" + JSON.stringify(etc, null, 2) : ""}`
          );
        })
      ),
    });
  };

  createConsoleLogger = (): winston.Logger => {
    return winston.createLogger({
      transports: [new winston.transports.Console()],
      format: winston.format.combine(
        winston.format.printf((info: any): string => {
          // 引数を展開する
          const {
            level, // デフォルトで level と message が渡る
            message,
            timestamp, // format.combine() で format.timestamp() 指定されている
            ...etc // その他の内容は JSON で表示する
          } = info;

          return (
            `[${moment(timestamp).format("YYYY-MM-DD HH:mm:SS")}] ${level}: ${message}` +
            (level != "info" ? `${etc && Object.keys(etc).length ? "\n" + JSON.stringify(etc, null, 2) : ""}` : "")
          );
        })
      ),
    });
  };
}

export const logger = new Logger();
