import {patchState, signalStore, withComputed, withHooks, withMethods, withState} from "@ngrx/signals";
import {computed, inject} from "@angular/core";
import {toRated} from "../utils";
import {DessertFilter} from "../../data/dessert-filter";
import {RatingService} from "../../data/rating.service";
import {DessertService} from "../../data/dessert.service";
import {rxMethod} from "@ngrx/signals/rxjs-interop";
import {Dessert} from "../../data/dessert";
import {catchError, of, switchMap, tap} from "rxjs";
import {ToastService} from "../../shared/toast";


export const DessertsStore = signalStore(
  {providedIn: 'root'},
  withState({
    filters: {
      originalName: '',
      englishName: ''
    },
    loading: false,
    desserts: <Dessert[]>[],
    ratings: {}
  }),

  withComputed((store) => ({
      ratedDeserts: computed(() => toRated(store.desserts(), store.ratings()))
    })
  ),

  withMethods((state, ratingService = inject(RatingService), dessertService = inject(DessertService), toastService = inject(ToastService),) => ({
    updateFilter(filter: DessertFilter) {
      patchState(state, {filters: filter});
    },
    loadRatings() {
      patchState(state, {loading: true});

      ratingService.loadExpertRatings().subscribe({
        next: (ratings) => {
          patchState(state, {ratings, loading: false});

        },
        error: (error) => {
          patchState(state, {loading: false});
          console.error(error);
        }
      })
    },
    updateRating(id: number, rating: number) {
      patchState(state, {
        ratings: {
          ...state.ratings,
          [id]: rating
        }
      })
    },

    loadDesserts: rxMethod<DessertFilter>((filter) => {
      patchState(state, {loading: true});
      return filter.pipe(
        switchMap((filters) => {
          return dessertService.find(filters).pipe(
            catchError((error) => {
              toastService.show('Error loading desserts!');
              console.error(error);
              return of([]);
            }),
            tap((res) => patchState(state, {desserts: res}, {loading: false}))
          )
        })
      )
    })
  })),
  withHooks({
    onInit: (state) => {
      state.loadDesserts(state.filters);
    }
  })
)
