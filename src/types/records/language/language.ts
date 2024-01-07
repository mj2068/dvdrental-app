type Language =
  | 'English'
  | 'Italian'
  | 'Japanese'
  | 'Mandarin'
  | 'French'
  | 'German';

interface LanguageRecord {
  language_id: number;
  name: Language;
  last_update: Date;
}

export type { LanguageRecord };
