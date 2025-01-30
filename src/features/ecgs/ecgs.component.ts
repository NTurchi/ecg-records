import { CommonModule } from '@angular/common';
import { Component, effect, inject, linkedSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Activity, LucideAngularModule } from 'lucide-angular';

import { EcgCardComponent } from './components/ecg-card/ecg-card.component';
import { EcgFiltersComponent } from './components/ecg-filters/ecg-filters.component';
import { EcgCardSkeletonComponent } from './components/ecg-card-skeleton/ecg-card-skeleton.component';
import { EcgsStore } from './stores/ecgs.store';
import { delay } from '../../core';

@Component({
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    EcgCardComponent,
    EcgFiltersComponent,
    EcgCardSkeletonComponent,
  ],
  providers: [EcgsStore],
  selector: 'app-ecgs',
  templateUrl: './ecgs.component.html',
})
export class EcgsComponent {
  #ecgsStore = inject(EcgsStore);

  ActivityIcon = Activity;

  ecgs = this.#ecgsStore.ecgs;
  labels = this.#ecgsStore.labels;
  labelById = this.#ecgsStore.labelById;
  isLoading = this.#ecgsStore.isLoading;
  hasError = linkedSignal(() => this.#ecgsStore.hasError());

  dismissErrorEffect = effect(async () => {
    if (this.hasError()) {
      await delay(2000);
      this.hasError.set(false);
    }
  });
}
