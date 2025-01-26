import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, Tag } from 'lucide-angular';

import { EcgService, debounce } from '../../../../core';
import { LabelBadgeComponent } from '../label-badge/label-badge.component';
import { EcgsStore } from '../../stores/ecgs.store';

@Component({
  imports: [CommonModule, FormsModule, LucideAngularModule, LabelBadgeComponent],
  providers: [EcgService],
  selector: 'app-ecg-filters',
  templateUrl: './ecg-filters.component.html',
})
export class EcgFiltersComponent {
  #ecgsState = inject(EcgsStore);

  SearchIcon = Search;
  TagIcon = Tag;

  labels = this.#ecgsState.labels;

  labelsFilter = signal<string[]>([]);
  nameFilter = signal<string>('');

  filterByLabel(labelId: string) {
    const isToggled = this.labelsFilter().includes(labelId);
    if (isToggled) {
      this.labelsFilter.set(this.labelsFilter().filter(id => id !== labelId));
    } else {
      this.labelsFilter.set([...this.labelsFilter(), labelId]);
    }
    this.filtersChange();
  }

  filterByPatientName(event: Event) {
    const target = event.target as HTMLInputElement;
    this.nameFilter.set(target.value);
    this.filtersChange();
  }

  filtersChange = debounce(() => {
    this.#ecgsState.updateFilter({
      patientFullName: this.nameFilter(),
      labelIds: this.labelsFilter(),
    });
  }, 500);
}
