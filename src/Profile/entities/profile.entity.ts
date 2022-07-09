import { Game } from "src/Game/entities/game.entity";

export class Profile {
  id?: string;
  gamer_tag: string;
  image_url: string;
  user_owner_id: string;
  favorite_games?: Partial<Game>[]
  created_at?: Date;
  updated_at?: Date;
}
