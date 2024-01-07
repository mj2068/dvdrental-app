import type { LanguageRecord } from '../language';
import type { CategoryRecord } from '../category';

type MPAARating = 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17';

interface FilmRecord {
  film_id: number;
  title: string;
  description?: string;
  release_year: number;
  rental_rate: number;
  rental_duration: number;
  replacement_cost: number;
  length: number;
  language_id: number;
  rating: MPAARating;
  special_features: string[];
  last_update: Date;
  fulltext: string;
  language: LanguageRecord;
  categories: CategoryRecord[];
  cast_count: number;
}

export type { FilmRecord, MPAARating };
