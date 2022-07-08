export class Game {
  id?: string;
  title: string;
  cover_image_url: string;
  description: string;
  year: number;
  score: number;
  trailer_url: string;
  gameplay_url: string;
  genres?: any[]
  created_at?: Date;
  updated_at?: Date;
}
