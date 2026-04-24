import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
    // Keep DB column name stable for cleanup queries and migrations.
    @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
    createdAt: Date;

    // Track last mutation time for auditing and admin operations.
    @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
    updatedAt: Date;
}