import { JsonPipe } from '@angular/common';
import {Component, OnInit, inject, signal, WritableSignal, computed, effect} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dessert } from '../data/dessert';
import { DessertFilter } from '../data/dessert-filter';
import { DessertService } from '../data/dessert.service';
import { DessertIdToRatingMap, RatingService } from '../data/rating.service';
import { DessertCardComponent } from '../dessert-card/dessert-card.component';
import { ToastService } from '../shared/toast';

@Component({
  selector: 'app-desserts',
  standalone: true,
  imports: [DessertCardComponent, FormsModule, JsonPipe],
  templateUrl: './desserts.component.html',
  styleUrl: './desserts.component.css',
})
export class DessertsComponent implements OnInit {
  #dessertService = inject(DessertService);
  #ratingService = inject(RatingService);
  #toastService = inject(ToastService);

  originalName = signal('');
  englishName = signal('');

  filters = computed(() => {
    return {
      originalName: this.originalName(),
      englishName: this.englishName(),
    }
  });

  loading = signal(false);

  desserts: WritableSignal<Dessert[]> = signal([]);

  ratings = signal<DessertIdToRatingMap>({});

  ratedDeserts = computed(() => this.toRated(this.desserts(), this.ratings()));


  constructor() {
    effect(() => {
      console.log('originalName', this.originalName());
      console.log('englishName', this.englishName());
    });

    effect( () => {
      this.#toastService.show(this.ratedDeserts().length + ' desserts loaded!');
    })


    this.originalName.set('Apple');
    this.englishName.set('Pie');


    this.originalName.set('Apple2');
    this.englishName.set('Pie3');

    setTimeout(() => {
      this.originalName.set('Kaiser');
      this.englishName.set('Mess');
    }, 1000);


  }
  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.loading.set(true);

    this.#dessertService.find(this.filters()).subscribe({
      next: (desserts) => {
        this.desserts.set(desserts);
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.#toastService.show('Error loading desserts!');
        console.error(error);
      },
    });
  }

  toRated(desserts: Dessert[], ratings: DessertIdToRatingMap): Dessert[] {
    return desserts.map((d) =>
      ratings[d.id] ? { ...d, rating: ratings[d.id] } : d,
    );
  }

  loadRatings(): void {
    this.loading.set(true);

    this.#ratingService.loadExpertRatings().subscribe({
      next: (ratings) => {
        this.ratings.set(ratings);
        this.loading.set(false);
      },
      error: (error) => {
        this.#toastService.show('Error loading ratings!');
        console.error(error);
        this.loading.set(false);
      },
    });
  }

  updateRating(id: number, rating: number): void {
    console.log('rating changed', id, rating);
  }
}
