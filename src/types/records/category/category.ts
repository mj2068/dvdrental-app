type Category =
  | 'Action'
  | 'Animation'
  | 'Children'
  | 'Classics'
  | 'Comedy'
  | 'Documentary'
  | 'Drama'
  | 'Family'
  | 'Foreign'
  | 'Games'
  | 'Horror'
  | 'Music'
  | 'New'
  | 'Sci-Fi'
  | 'Sports'
  | 'Travel';

interface CategoryRecord {
  category_id: number;
  name: Category;
  last_update: Date;
}

export type { CategoryRecord };
