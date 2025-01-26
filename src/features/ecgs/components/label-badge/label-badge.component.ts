import { Component, computed, input } from '@angular/core';

import { Label } from '../../../../core';

type Status = 'info' | 'success' | 'warning' | 'error';
type BadgeStatus = `badge-${Status}`;

const COLOR_STATUS_MAP: Record<Label['color'], BadgeStatus> = {
  gray: 'badge-info',
  green: 'badge-success',
  yellow: 'badge-warning',
  red: 'badge-error',
};

@Component({
  selector: 'app-label-badge',
  templateUrl: './label-badge.component.html',
})
export class LabelBadgeComponent {
  label = input.required<Label>();

  badgeStatus = computed(() => COLOR_STATUS_MAP[this.label().color]);
}
