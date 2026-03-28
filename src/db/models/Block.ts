import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, relation } from '@nozbe/watermelondb/decorators';
import { BlockContent } from '../../types/block';
import { parseContent, serializeContent } from '../../utils/contentJson';

export default class Block extends Model {
  static table = 'blocks';

  static associations = {
    tabs: { type: 'belongs_to' as const, key: 'tab_id' },
  };

  @field('tab_id') tabId!: string;
  @field('type') type!: string;
  @field('content_json') contentJson!: string;
  @field('block_order') blockOrder!: number;
  @readonly @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  @relation('tabs', 'tab_id') tab!: any;

  get content(): BlockContent {
    return parseContent(this.contentJson);
  }

  setContent(content: BlockContent) {
    return this.update((b) => {
      b.contentJson = serializeContent(content);
    });
  }
}
