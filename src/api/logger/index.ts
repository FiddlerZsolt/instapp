import { info } from '../utils/helpers';

export const apiLogger = (message: string, ...rest: string[]) => {
  info(message, ...rest);
};
