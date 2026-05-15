//implement auth cleanup service
import { Injectable, Logger } from '@nestjs/common';
import { UserEntityRepository } from '../auth.repository';

const UNVERIFIED_TTL_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class AuthCleanupService {
    private readonly logger = new Logger(AuthCleanupService.name);

    constructor(private readonly userRepo: UserEntityRepository) {}

    async removeNotVerifiedUsers(batchSize: number = 100) {
        // Only delete accounts that stayed unverified for at least 24 hours.
        const cutoff = new Date(Date.now() - UNVERIFIED_TTL_MS);
        let totalRemoved = 0;
        while (true) {
            try { //try to remove users 
        const userIds = await this.userRepo.findDeletableUnverifiedUserIds(
          cutoff,
          batchSize,
        );
        if (userIds.length === 0) break; //if no users to remove, break the loop
    
        totalRemoved += userIds.length;
        await this.userRepo.delete(userIds); //delete for higher performance than remove method
    
        // Short pause between batches to reduce DB pressure.
        await new Promise(resolve => setTimeout(resolve, 300));
    
        } catch (error) {
          this.logger.error('Error removing not verified users', error instanceof Error ? error.stack : undefined);
          await new Promise(resolve => setTimeout(resolve, 1000)); //wait 1 second before next batch
        }
      }
      this.logger.log(`Removed ${totalRemoved} unverified users`);
      return {totalRemoved};
    }
}