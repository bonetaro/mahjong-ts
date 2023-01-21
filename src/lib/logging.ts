import moment from "moment";
import { createLogger, transports, format } from "winston";

export const logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
  ],
  format: format.combine(
    format.errors({ stack: true }),
    // format.colorize(),
    // format.splat(),
    // format.metadata(),
    // format.timestamp(),
    // format.prettyPrint(),
    // format.printf(({ timestamp, level, message, metadata }) => {
    //   if (metadata && Object.keys(metadata).length > 0) {
    //     return `[${timestamp}]${level}:${message} ${JSON.stringify(metadata)}`;
    //   } else {
    //     return `[${timestamp}]${level}:${message}`;
    //   }
    // })
    format.printf((info: any): string => {
      // 引数を展開する
      const {
        level, // デフォルトで level と message が渡る
        message,
        timestamp, // format.combine() で format.timestamp() 指定されている
        ...etc // その他の内容は JSON で表示する
      } = info;

      // フォーマットした文字列を返す
      return (
        `${moment(timestamp).format("YYYY-MM-DD HH:mm:SS")} [${level}] ${message}` +
        `${etc && Object.keys(etc).length ? "\n" + JSON.stringify(etc, null, 2) : ""}`
      );
    })
  ),
});

export function LogEvent(text: string): void {
  logger.info("--------------------------------------------------------");
  logger.info(text);
  logger.info("--------------------------------------------------------");
}
