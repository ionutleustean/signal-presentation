import {Dessert} from "../data/dessert";
import {DessertIdToRatingMap} from "../data/rating.service";


export const toRated = (desserts: Dessert[], ratings: DessertIdToRatingMap): Dessert[] => {
  return desserts.map((d) =>
    ratings[d.id] ? { ...d, rating: ratings[d.id] } : d,
  );
}
