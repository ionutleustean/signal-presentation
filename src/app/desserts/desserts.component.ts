import {JsonPipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DessertFilter} from '../data/dessert-filter';
import {DessertCardComponent} from '../dessert-card/dessert-card.component';
import {DessertsStore} from "./+state/desserts.store";
import {FormUpdateDirective} from "../shared/form-update.directive";

@Component({
  selector: 'app-desserts',
  standalone: true,
  imports: [DessertCardComponent, FormsModule, JsonPipe, FormUpdateDirective],
  templateUrl: './desserts.component.html',
  styleUrl: './desserts.component.css',
})
export class DessertsComponent {


  #store = inject(DessertsStore);

  originalName = this.#store.filters.originalName;
  englishName = this.#store.filters.originalName;
  loading = this.#store.loading;

  ratedDeserts = this.#store.ratedDeserts;

  loadRatings(): void {
    this.#store.loadRatings();
  }

  updateRating(id: number, rating: number): void {
    this.#store.updateRating(id, rating);
  }

  updateFilters(event: DessertFilter) {
    this.#store.updateFilter(event);
  }
}
