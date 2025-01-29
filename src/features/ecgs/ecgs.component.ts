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
  #ecgsState = inject(EcgsStore);

  ActivityIcon = Activity;

  ecgs = this.#ecgsState.ecgs;
  labels = this.#ecgsState.labels;
  labelById = this.#ecgsState.labelById;
  isLoading = this.#ecgsState.loading;
  hasError = linkedSignal(() => this.#ecgsState.error());

  dismissErrorEffect = effect(async () => {
    if (this.hasError()) {
      await delay(2000);
      this.hasError.set(false);
    }
  });
}
