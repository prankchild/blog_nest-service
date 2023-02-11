import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { DocumentBuilder } from '@nestjs/swagger/dist';
import rateLimit from 'express-rate-limit';
import { mw as requestIpMw } from 'request-ip';
import express from 'express';
import Chalk from 'chalk';
import fs from 'fs';

import { logger } from '@/utils/log/logger.middleware';
import { Logger } from '@/utils/log/log4js.log.util';

import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 设置访问频率
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15分钟
      max: 1000, // 限制15分钟内最多只能访问1000次
    }),
  );
  // 设置 api 访问前缀
  const config = app.get(ConfigService);
  const port = config.get<number>('app.port');
  const prefix = config.get<string>('app.prefix');
  app.setGlobalPrefix(prefix);

  // 获取用户真实 ip
  app.use(requestIpMw({ attributeName: 'ip' }));

  // API文档
  const options = new DocumentBuilder()
    .setTitle('博客管理系统API文档')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  fs.writeFileSync('./swagger-spec.json', JSON.stringify(document));
  SwaggerModule.setup('/api-docs', app, document);

  // 日志
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(logger);

  await app.listen(port);

  Logger.log(
    Chalk.yellow(
      '------------------------------------------------------------------',
    ),
    '\n',
    Chalk.green.bold(`blog_nest_service 服务已经启动`),
    `http://localhost:${port}${prefix}`,
    '\n',
    Chalk.yellow(
      '------------------------------------------------------------------',
    ),
    '\n',
    Chalk.green.bold('swagger API文档地址'),
    `http://localhost:${port}${prefix}-docs`,
    '\n',
    Chalk.yellow(
      '------------------------------------------------------------------',
    ),
  );
}
bootstrap();
