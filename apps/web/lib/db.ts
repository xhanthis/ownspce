import { createDb } from '@ownspce/db';

export const db = createDb(process.env.DATABASE_URL!);
