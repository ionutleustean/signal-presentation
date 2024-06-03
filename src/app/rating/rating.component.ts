import {
  Component, computed,
  EventEmitter, input,
  Input, model,
  OnChanges, output,
  Output, signal,
} from '@angular/core';

const maxRatingInCheatMode = 500;

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css',
})
export class RatingComponent {
  // @Input({ required: true })
  rating = model.required<number>() ;

  cheatModel = signal(false)

  maxRating = computed(() =>  this.rating() > 5 || this.cheatModel() ? maxRatingInCheatMode : 5);

  stars = computed(() => RatingComponent.toStars(this.rating(), this.maxRating()));

  private static toStars(rating: number, maxRating: number): Array<boolean> {
    const stars = new Array<boolean>(rating);
    for (let i = 0; i < maxRating; i++) {
      stars[i] = i < rating;
    }
    return stars;
  }

  rate(rating: number): void {
    this.rating.set(rating);
  }

  enterCheatMode() {
    this.cheatModel.set(true)
  }
}
