import { logger } from "./logging";

export class CustomError extends Error {
  constructor(messageOrObject: any, metadata?: any) {
    super();

    const jsonStringify = (obj: any) => JSON.stringify(obj, null, 2);

    if (metadata) {
      if (typeof messageOrObject == "string") {
        logger.error(messageOrObject, jsonStringify(metadata));
      } else {
        logger.error(jsonStringify(messageOrObject), jsonStringify(metadata));
      }
    } else {
      if (typeof messageOrObject == "string") {
        logger.error(messageOrObject);
      } else {
        logger.error(jsonStringify(messageOrObject));
      }
    }
  }
}
