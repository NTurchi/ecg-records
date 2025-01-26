import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Ecg, Label } from '../../../../core';
import { LabelBadgeComponent } from '../label-badge/label-badge.component';

@Component({
  imports: [CommonModule, LabelBadgeComponent],
  selector: 'app-ecg-card',
  templateUrl: './ecg-card.component.html',
})
export class EcgCardComponent {
  ecg = input.required<Ecg>();
  label = input.required<Label>();
  labels = input.required<Label[]>();

  updateLabel = output<Label>();
}
