//create producer for auth
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { JOBS_NAME, QUEUE_NAME } from 'src/queue/queue.constant';

@Injectable()
export class AuthProducer implements OnModuleInit {
  private readonly logger = new Logger(AuthProducer.name);

  constructor(@InjectQueue(QUEUE_NAME.AUTH) private readonly queue: Queue) {}

  async onModuleInit() {

    //clean old jobs if restart dev local, not production
    await this.cleanOldUnverifiedUsersJob()
    await this.cleanOldCommitReminderJob()
    // Register repeatable jobs on boot (idempotent with the same jobId + repeat options).
    await this.repeatCleanNotVerifiedUsersAtMidnightJob();
    await this.repeatCommitReminderJob();

  }

  async sendEmail(
    toEmail: string,
    nameTemplate: string,
    data: Record<string, string>,
    jobId?: string,
  ) {
    await this.queue.add(
      JOBS_NAME.SEND_EMAIL_VERIFICATION,
      { to: toEmail, template: nameTemplate, data: data },
      { ...(jobId && { jobId }) },
    );
  }

  async repeatCleanNotVerifiedUsersAtMidnightJob() {
    await this.queue.add(
      JOBS_NAME.DAILY_CLEAN_NOT_VERIFIED_USERS_AT_MIDNIGHT,
      {},
      {
        jobId: 'daily-clean-not-verified-users-at-midnight',
        repeat: {
          // Run at 23:55 every day in Vietnam timezone.
          // pattern: '55 23 * * *',
          tz: 'Asia/Ho_Chi_Minh',

          //run at 15:10 everyday for testing
          pattern: '35 15 * * *',
        },
      },
    );
    this.logger.log(
      'Registered repeat job: daily clean unverified users (23:55 Asia/Ho_Chi_Minh)',
    );
  }

  async repeatCommitReminderJob() {
    await this.queue.add(
      JOBS_NAME.DAILY_COMMIT_REMINDER,
      {},
      {
        jobId: 'daily-commit-reminder',
        repeat: {
          // Weekdays at 17:20 (Vietnam timezone).
          pattern: '20 17 * * 1-5',
          tz: 'Asia/Ho_Chi_Minh',
        },
      },
    );
    this.logger.log(
      'Registered repeat job: daily commit reminder (17:20 Asia/Ho_Chi_Minh)',
    );
  }

  //clean oldjobs
  async cleanOldUnverifiedUsersJob() {
    const repeatableJobs = await this.queue.getJobSchedulers();
    for (const job of repeatableJobs) {
      if (job.name === JOBS_NAME.DAILY_CLEAN_NOT_VERIFIED_USERS_AT_MIDNIGHT) {
        await this.queue.removeJobScheduler(job.key);
      }
    }
  }

  async cleanOldCommitReminderJob() {
    const repeatableJobs = await this.queue.getJobSchedulers();
    for (const job of repeatableJobs) {
      if (job.name === JOBS_NAME.DAILY_COMMIT_REMINDER) {
        await this.queue.removeJobScheduler(job.key);
      }
    }
  }
}
