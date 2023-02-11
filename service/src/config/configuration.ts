import { JwtType } from '@/types/common/common';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
export const configuration = () => ({
  app: {
    port: process.env.PORT,
    prefix: process.env.PREFIX,
  },
  // 数据库配置信息
  database: {
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: Number.parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME,
    entities: [__dirname + '/../**/entities/*.entity.{ts,js}'],
    migrations: ['dist/src/migrations/**/*.js'],
    autoLoadEntities: true,
    /** https://typeorm.io/migrations */
    synchronize: true,
    logging: true,
    timezone: '+08:00', // 东八区
    cli: {
      migrationsDir: 'src/migrations',
    },
  } as MysqlConnectionOptions,
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY,
    expiresIn: process.env.JWT_EXPIRES_IN,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  } as JwtType,
  logger: {
    dir: process.env.LOGGER_DIR,
  },
  user: {
    resetPassword: 'abc123',
  },
});
export type ConfigurationType = ReturnType<typeof configuration>;
