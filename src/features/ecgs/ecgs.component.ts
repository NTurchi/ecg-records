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

  #ecgsQuery = this.#ecgService.getEcgs(this.ecgSearchFilters);
  #labelsQuery = this.#labelService.getLabels();

  ActivityIcon = Activity;

  ecgs = linkedSignal(() => this.#ecgsQuery.data() || []);
  labels = computed(() => this.#labelsQuery.data() || []);
  labelById = computed<Record<string, Label>>(() =>
    this.labels().reduce((acc, label) => ({ ...acc, [label.id]: label }), {})
  );
  isLoading = computed(() => this.#ecgsQuery.isLoading() || this.#labelsQuery.isLoading());
  hasError = signal(false);

  errorEffect = effect(async () => {
    if (this.hasError()) {
      await delay(3000);
      this.hasError.set(false);
    }
  });

  updateLabelOnEcg(ecgId: string, labelId: string) {
    this.#ecgService.updateEcg.mutate(
      { ecgId, ecg: { labelId } },
      { onError: () => this.hasError.set(true) }
    );
  }

  onFiltersChange = debounce(
    (filters: EcgSearchFilters) => this.ecgSearchFilters.set(filters),
    500
  );
}
