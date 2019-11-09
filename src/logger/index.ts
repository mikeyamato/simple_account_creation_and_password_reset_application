import { createLogger, format, transports } from 'winston';
import { CUSTOM_COLORIZE } from '../constants/colorizer';

const logger = createLogger({
	level: 'debug',  // default is 'info'. other option 'debug'
  format: format.combine(
		format.colorize({ all: true, colors: CUSTOM_COLORIZE }),
		format.simple(),
    format.timestamp(),
    // format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    //
    // - Write to all logs with level `info` and below to `quick-start-combined.log`.
    // - Write all logs error (and below) to `quick-start-error.log`.
    //
    new transports.File({ filename: 'quick-start-error.log', level: 'error' }),
    new transports.File({ filename: 'quick-start-combined.log' })
  ]
})

//
// If we're not in production then **ALSO** log to the `console`
// with the colorized simple format.
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    )
  }));
}

export default logger;