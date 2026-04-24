//implement mail service
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}


  async sendEmail(to: string, template: string, data:  Record<string, string>) {
    await this.mailerService.sendMail({
      to,
      subject: 'Email Verification',
      template: template,
      context: data, //đây là object các biến trong template
    })
  }
}