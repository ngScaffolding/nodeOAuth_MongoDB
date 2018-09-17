import {Logger as WinstonLogger, transports, LoggerInstance } from 'winston'

// const logLevel = (process.env.LOGLEVEL || 'info')

export class Logger {

  public logger: LoggerInstance //: winston.Logger
  private logLevel: string

  private transports = {

  }

  constructor(private module: string, logLevel: string = (process.env.LOGLEVEL || 'info')) {

    this.logLevel = logLevel

    this.transports['console']= new transports.Console({
      level: this.logLevel,
      handleExceptions: true,
      json: false,
      colorize: true,
      timestamp: true,
      humanReadableUnhandledException: true,
    })

    this.transports['request']= new transports.Console({
      json: true,
      colorize: true,
      timestamp: true,
    })

    this.logger = new WinstonLogger({
      transports: [
        this.getTransport('console'),
      ],
      exitOnError: false,
    })
  }

  public error(err: Error, ...messages: string[]) {
    this.logger.error(`${this.module} ${messages.join(' ')}`, err, err.stack)
  }

  public info(...messages: string[]) {
    this.logger.info(`${this.module} ${messages.join(' ')}`)
  }

  public debug(...messages: string[]) {
    this.logger.debug(`${this.module} ${messages.join(' ')}`)
  }

  public warn(...messages: string[]) {
    this.logger.warn(`${this.module} ${messages.join(' ')}`)
  }

  public getTransport(name: string) {
    // this.logger.debug(`Looking up transport: ${name}`)
    if( typeof this.logger !=='undefined')
    {
      this.logger.debug(`Looking up transport: ${name}`)
    }
    return this.transports[name]
  }

}
