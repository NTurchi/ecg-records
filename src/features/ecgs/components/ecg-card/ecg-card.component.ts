import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';

import { Ecg, Label } from '../../../../core';
import { LabelBadgeComponent } from '../label-badge/label-badge.component';
import { EcgsStore } from '../../stores/ecgs.store';

@Component({
  imports: [CommonModule, LabelBadgeComponent],
  selector: 'app-ecg-card',
  templateUrl: './ecg-card.component.html',
})
export class EcgCardComponent {
  #ecgsStore = inject(EcgsStore);

  ecg = input.required<Ecg>();

  label = computed(() => this.#ecgsStore.labelById()[this.ecg().labelId]);
  labels = this.#ecgsStore.labels;

  updateLabel(label: Label) {
    this.#ecgsStore.updateLabelOnEcg(this.ecg().id, label.id);
  }
}
