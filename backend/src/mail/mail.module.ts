//setup mail module
import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { join } from 'path';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
    imports: [MailerModule.forRootAsync({
        useFactory: (config: ConfigService) => ({
            transport: {
                host: config.get<string>('MAIL_HOST') ?? 'localhost',
                port: config.get<number>('MAIL_PORT') ?? 1025,
            },
            defaults: {
                from: config.get<string>('MAIL_FROM') ?? 'noreply@vozclone.local',
            },
            template: {
                dir: join(__dirname, 'templates'),
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true, //biến này để kiểm tra xem các biến trong template có được sử dụng không
                },
            },
        }),
        inject: [ConfigService]
    })],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}