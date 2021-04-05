const morgan = require('morgan');
const logger = require('../utils/logger');

logger.stream = {
  write: (message: string) =>
    logger.info(message.substring(0, message.lastIndexOf('\n'))),
}   ;

export default morgan(
  ':method :url :status :response-time ms - :res[content-length]',
  { stream: logger.stream }
);
