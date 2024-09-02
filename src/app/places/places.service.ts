import { Injectable, inject, signal } from '@angular/core';
import { catchError, map, tap, throwError } from 'rxjs';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);

  private httpClient = inject(HttpClient);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces(
      'http://localhost:3000/places',
      'Some error occurred. Please try again!'
    );
  }

  loadUserPlaces() {
    return this.fetchPlaces(
      'http://localhost:3000/user-places',
      'Some error occurred in your favorite places. Please try again!'
    )
    // .pipe(tap({
    //   next: (userPlaces) => this.userPlaces.set(userPlaces),
    // }));
  }

  addPlaceToUserPlaces(placeId: string) {
    return this.httpClient.put('http://localhost:3000/user-places', {
      placeId,
    });
  }

  private fetchPlaces(url: string, message: string) {
    return this.httpClient.get<{ places: Place[] }>(url).pipe(
      map((redData) => redData.places),
      catchError((error) => {
        console.log(error);
        return throwError(() => {
          new Error(message);
        });
      })
    );
  }

  removeUserPlace(place: Place) {}
}
