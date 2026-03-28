import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class SyncQueue extends Model {
  static table = 'sync_queue';

  @field('table_name') tableName!: string;
  @field('record_id') recordId!: string;
  @field('action') action!: string;
  @field('synced') synced!: boolean;
  @readonly @date('created_at') createdAt!: Date;
}
