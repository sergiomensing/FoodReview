export type Team = {
  id: number;
  name: string;
  description: string;
};

export type Meal = {
  id: number;
  team_id: number;
  name: string;
  image_url: string;
  description: string;
};

export type Setting = {
  id: number;
  key: string;
  value: string;
};

export type Review = {
  id: number;
  meal_id: number;
  user_id: number;
  overall_rating: number;
  review: string;
  name: string;
  review_ratings?: ReviewRating[];
};

export type ReviewRating = {
  id: number;
  category: string;
  rating: number;
  review_id: number;
};
