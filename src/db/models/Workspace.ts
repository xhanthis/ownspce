import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, children } from '@nozbe/watermelondb/decorators';

export default class Workspace extends Model {
  static table = 'workspaces';

  static associations = {
    tabs: { type: 'has_many' as const, foreignKey: 'workspace_id' },
  };

  @field('name') name!: string;
  @field('color') color!: string;
  @field('emoji') emoji!: string | null;
  @readonly @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  @children('tabs') tabs!: any;
}
