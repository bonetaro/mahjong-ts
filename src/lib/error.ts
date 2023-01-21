import { logger } from "./logging";

export const throwErrorAndLogging = (obj: any) => {
  logger.error(JSON.stringify(obj, null, 2));
  throw new Error();
};
