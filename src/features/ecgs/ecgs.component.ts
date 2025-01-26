import { CommonModule } from '@angular/common';
import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Activity, LucideAngularModule } from 'lucide-angular';

import { debounce, EcgSearchFilters, EcgService, Label, LabelService } from '../../core';
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

  updateLabelOnEcg(ecgId: string, labelId: string) {
    // optimistic update with linked signals
    this.ecgs.set(
      this.ecgs().map(ecg => {
        if (ecg.id === ecgId) {
          return { ...ecg, labelId };
        }
        return ecg;
      })
    );
    this.#ecgService.updateEcg.mutateAsync({ ecgId, ecg: { labelId } });
  }

  onFiltersChange = debounce(
    (filters: EcgSearchFilters) => this.ecgSearchFilters.set(filters),
    500
  );
}
