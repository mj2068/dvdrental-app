import type { FilmRecord } from '../film';

interface InventoryRecord {
  id: number;
  film_id: number;
  film: FilmRecord;
  last_update: Date;
  store: any; // implatement later
  store_id: number;
}

export type { InventoryRecord };
