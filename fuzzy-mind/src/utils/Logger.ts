/**
 * Utilitaire de journalisation avancé pour Fuzzy-Mind
 * Supporte différents niveaux de log et sorties personnalisables
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogMethod = (message: string, ...meta: any[]) => void;

interface LoggerOptions {
  level?: LogLevel;
  context?: string;
  timestamp?: boolean;
  colors?: boolean;
}

export class Logger {
  private static readonly LEVELS: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  private static readonly COLORS = {
    debug: '\x1b[36m', // Cyan
    info: '\x1b[32m',  // Green
    warn: '\x1b[33m',  // Yellow
    error: '\x1b[31m', // Red
    reset: '\x1b[0m',  // Reset
    grey: '\x1b[90m',  // Grey
  };

  private readonly name: string;
  private readonly level: number;
  private readonly context: string;
  private readonly timestamp: boolean;
  private readonly colors: boolean;

  constructor(name: string, options: LoggerOptions = {}) {
    this.name = name;
    this.level = Logger.LEVELS[options.level || 'info'];
    this.context = options.context || 'main';
    this.timestamp = options.timestamp !== false;
    this.colors = options.colors !== false;
  }

  private log(level: LogLevel, message: string, ...meta: any[]): void {
    if (Logger.LEVELS[level] < this.level) return;

    const timestamp = this.timestamp ? this.getTimestamp() : '';
    const context = this.formatContext();
    const levelStr = this.formatLevel(level);
    
    const logMessage = [
      timestamp,
      levelStr,
      `[${this.name}]`,
      context,
      message,
      ...(meta.length > 0 ? [JSON.stringify(meta, null, 2)] : [])
    ].filter(Boolean).join(' ');

    const consoleMethod = level === 'error' ? 'error' :
                         level === 'warn' ? 'warn' :
                         'log';

    console[consoleMethod](logMessage);
  }

  private formatLevel(level: LogLevel): string {
    if (!this.colors) return `[${level.toUpperCase()}]`;
    
    const color = Logger.COLORS[level];
    return `${color}[${level.toUpperCase()}]${Logger.COLORS.reset}`;
  }

  private formatContext(): string {
    if (!this.context) return '';
    return this.colors 
      ? `${Logger.COLORS.grey}(${this.context})${Logger.COLORS.reset}`
      : `(${this.context})`;
  }

  private getTimestamp(): string {
    const now = new Date();
    const timeString = now.toISOString()
      .replace('T', ' ')
      .replace(/\..+/, '');
    
    return this.colors
      ? `${Logger.COLORS.grey}${timeString}${Logger.COLORS.reset}`
      : timeString;
  }

  // Méthodes publiques
  public debug(message: string, ...meta: any[]): void {
    this.log('debug', message, ...meta);
  }

  public info(message: string, ...meta: any[]): void {
    this.log('info', message, ...meta);
  }

  public warn(message: string, ...meta: any[]): void {
    this.log('warn', message, ...meta);
  }

  public error(message: string | Error, ...meta: any[]): void {
    const errorMessage = message instanceof Error 
      ? `${message.name}: ${message.message}\n${message.stack}`
      : message;
    
    this.log('error', errorMessage, ...meta);
  }

  // Créer un nouveau logger avec un contexte supplémentaire
  public child(context: string): Logger {
    return new Logger(this.name, {
      level: Object.entries(Logger.LEVELS).find(([_, v]) => v === this.level)?.[0] as LogLevel || 'info',
      context: this.context ? `${this.context}.${context}` : context,
      timestamp: this.timestamp,
      colors: this.colors,
    });
  }
}
