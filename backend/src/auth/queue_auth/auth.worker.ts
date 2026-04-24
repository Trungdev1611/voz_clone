// implement worker for auth
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { JOBS_NAME, QUEUE_NAME } from 'src/queue/queue.constant';
import { MailService } from 'src/mail/mail.service';
import { Logger } from '@nestjs/common';
import { AuthCleanupService } from '../service_auth/auth.cleanup.service';

 type JobData = { //từ bên add job sẽ gửi data vào job
    to: string;
    template: string;
    data: Record<string, string>;
 }
 type JobResult = {
    success: boolean;
    data?: Record<string, any>;
 }

@Processor(QUEUE_NAME.AUTH)
export class AuthWorker extends WorkerHost{
    private readonly logger = new Logger(AuthWorker.name);
        constructor(private readonly mailService: MailService,
            private readonly authCleanupService: AuthCleanupService
        ) {
        super();
        }

  async process(job: Job<JobData>): Promise<JobResult> {
    try {
        switch (job.name) {
            case JOBS_NAME.SEND_EMAIL_VERIFICATION:
                await this.mailService.sendEmail(
                  job.data.to,
                  job.data.template, //tên template trong folder templates
                  job.data.data,
                );
                return {success: true, data: job.data};

            case JOBS_NAME.DAILY_CLEAN_NOT_VERIFIED_USERS_AT_MIDNIGHT:
                const data =await this.authCleanupService.removeNotVerifiedUsers(100);
                return {success: true, data};
            case JOBS_NAME.DAILY_COMMIT_REMINDER:
                // This is a lightweight reminder job; keep it side-effect free (log only).
                this.logger.warn(
                  '[REMINDER] 17:20 - Commit/push your changes before leaving.',
                );
                return { success: true, data: { remindedAt: new Date().toISOString() } };
            default:
                throw new Error(`Invalid job name: ${job.name}`);
        }
    } catch (error) {
        this.logger.error(  `Job failed: id=${job.id}, name=${job.name}, attemptsMade=${job.attemptsMade}, payload=${JSON.stringify(job.data)}`,
        error instanceof Error ? error.stack : undefined,);
        throw error;
    }
    
    this.logger.log(`Job completed: id=${job.id}, name=${job.name}, attemptsMade=${job.attemptsMade}`);
  }
}