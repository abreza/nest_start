import { JwtModuleOptions } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { winstonConsole } from './factory/winston.config';
dotenv.config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }
    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return +this.getValue('HTTP_PORT', true);
  }

  public getWinstonConfig() {
    return winstonConsole();
  }

  public getDbUrl() {
    const user = this.getValue('DB_USER');
    const pass = this.getValue('DB_PASS');
    const name = this.getValue('DB_NAME');
    const host = this.getValue('DB_HOST');
    const port = this.getValue('DB_PORT');
    return `mongodb://${user}:${pass}@${host}:${port}/${name}`;
  }

  public getGmailAuth(): { user: string; pass: string } {
    return {
      user: this.getValue('GMAIL_USERNAME'),
      pass: this.getValue('GMAIL_PASSWORD'),
    };
  }

  public getSuperUser(): { username: string; password: string } {
    return {
      username: this.getValue('SUPERUSER_USERNAME'),
      password: this.getValue('SUPERUSER_PASSWORD'),
    };
  }

  public getJwtConfig(): JwtModuleOptions {
    return {
      secret: this.getValue('JWT_SECRET', true),
      signOptions: {
        expiresIn: this.getValue('JWT_EXPIRE_IN', false) || '60m',
      },
    };
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'HTTP_PORT',
  'DB_USER',
  'DB_PASS',
  'DB_NAME',
  'DB_HOST',
  'DB_PORT',
  'GMAIL_USERNAME',
  'GMAIL_PASSWORD',
  'SUPERUSER_USERNAME',
  'SUPERUSER_PASSWORD',
  'JWT_SECRET',
]);

export { configService };
