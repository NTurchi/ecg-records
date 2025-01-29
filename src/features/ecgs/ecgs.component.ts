import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, linkedSignal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Activity, LucideAngularModule } from 'lucide-angular';

import { debounce, delay, EcgSearchFilters, EcgService, Label, LabelService } from '../../core';
import { EcgCardComponent } from './components/ecg-card/ecg-card.component';
import { EcgFiltersComponent } from './components/ecg-filters/ecg-filters.component';
import { EcgCardSkeletonComponent } from './components/ecg-card-skeleton/ecg-card-skeleton.component';

@Component({
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    EcgCardComponent,
    EcgFiltersComponent,
    EcgCardSkeletonComponent,
  ],
  providers: [EcgService],
  selector: 'app-ecgs',
  templateUrl: './ecgs.component.html',
})
export class EcgsComponent {
  #ecgService = inject(EcgService);
  #labelService = inject(LabelService);

  ecgSearchFilters = signal<EcgSearchFilters>({
    labelIds: undefined,
    patientFullName: undefined,
  });

  #ecgResource = this.#ecgService.getEcgs(this.ecgSearchFilters);
  #labelsResource = this.#labelService.getLabels();

  ActivityIcon = Activity;

  ecgs = computed(() => this.#ecgResource.value() || []);
  labels = computed(() => this.#labelsResource.value() || []);
  labelById = computed<Record<string, Label>>(() =>
    this.labels().reduce((acc, label) => ({ ...acc, [label.id]: label }), {})
  );
  isLoading = computed(() => this.#ecgResource.isLoading() || this.#labelsResource.isLoading());
  hasError = linkedSignal(() => this.#ecgResource.error() || this.#labelsResource.error());

  errorEffect = effect(async () => {
    if (this.hasError()) {
      await delay(3000);
      this.hasError.set(false);
    }
  });

  async updateLabelOnEcg(ecgId: string, labelId: string) {
    // optimistic update with resource.update
    const previousList = this.ecgs();
    this.#ecgResource.update((ecgs = []) =>
      ecgs.map(ecg => {
        if (ecg.id === ecgId) {
          return { ...ecg, labelId };
        }
        return ecg;
      })
    );

    try {
      await this.#ecgService.updateEcg(ecgId, { labelId });
    } catch (e) {
      this.hasError.set(true);
      this.#ecgResource.update(() => previousList);
    }
  }

  onFiltersChange = debounce(
    (filters: EcgSearchFilters) => this.ecgSearchFilters.set(filters),
    500
  );
}
