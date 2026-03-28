import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, relation, children } from '@nozbe/watermelondb/decorators';

export default class Tab extends Model {
  static table = 'tabs';

  static associations = {
    workspaces: { type: 'belongs_to' as const, key: 'workspace_id' },
    blocks: { type: 'has_many' as const, foreignKey: 'tab_id' },
  };

  @field('workspace_id') workspaceId!: string;
  @field('title') title!: string;
  @field('template_type') templateType!: string;
  @field('emoji') emoji!: string | null;
  @field('tab_order') tabOrder!: number;
  @field('settings') settings!: string | null;
  @field('pinned') pinned!: boolean;
  @readonly @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  @relation('workspaces', 'workspace_id') workspace!: any;
  @children('blocks') blocks!: any;
}
