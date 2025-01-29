import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, Tag } from 'lucide-angular';

import { EcgSearchFilters, EcgService, Label } from '../../../../core';
import { LabelBadgeComponent } from '../label-badge/label-badge.component';

@Component({
  imports: [CommonModule, FormsModule, LucideAngularModule, LabelBadgeComponent],
  providers: [EcgService],
  selector: 'app-ecg-filters',
  templateUrl: './ecg-filters.component.html',
})
export class EcgFiltersComponent {
  SearchIcon = Search;
  TagIcon = Tag;

  labels = input.required<Label[]>();
  filtersChange = output<EcgSearchFilters>();

  labelsFilter = signal<string[]>([]);
  patientFullNameFilter = signal<string>('');

  filterByLabel(labelId: string) {
    const isToggled = this.labelsFilter().includes(labelId);
    if (isToggled) {
      this.labelsFilter.set(this.labelsFilter().filter(id => id !== labelId));
    } else {
      this.labelsFilter.set([...this.labelsFilter(), labelId]);
    }
    this.emitFiltersChange();
  }

  filterByPatientName(event: Event) {
    const target = event.target as HTMLInputElement;
    this.patientFullNameFilter.set(target.value);
    this.emitFiltersChange();
  }

  emitFiltersChange() {
    this.filtersChange.emit({
      labelIds: this.labelsFilter(),
      patientFullName: this.patientFullNameFilter(),
    });
  }
}
