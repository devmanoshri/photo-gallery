import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  isFetching = signal(false);
  error = signal('');

  private destroyRef = inject(DestroyRef);
  private placeService = inject(PlacesService);

  places = signal<Place[] | undefined>(undefined);
 //places= this.placeService.loadUserPlaces;

  ngOnInit(): void {
    this.isFetching.set(true);
    const subscription = this.placeService.loadUserPlaces().subscribe({
      next:(resData)=>{
        this.places.set(resData)
      },
      error: (error: Error) => {
        this.error.set(error.message);
      },
      complete: () => {
        this.isFetching.set(false);
      },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
