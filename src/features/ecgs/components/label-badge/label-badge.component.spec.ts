import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getByText } from '@testing-library/dom';

import { LabelBadgeComponent } from './label-badge.component';
import { getLabelMock } from '../../../../mocks/label.mock';
import { Label } from '../../../../core';

describe('LabelBadgeComponent', () => {
  let fixture: ComponentFixture<LabelBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabelBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabelBadgeComponent);
  });

  it('should display the label name', () => {
    const label = getLabelMock({ name: 'Major Stuff', color: 'red' });

    fixture.componentRef.setInput('label', label);
    fixture.detectChanges();

    const badgeName = getByText(fixture.nativeElement, label.name);
    expect(badgeName).toBeTruthy();
  });

  const colorStatus: Array<[Label['color'], string]> = [
    ['gray', 'badge-info'],
    ['green', 'badge-success'],
    ['yellow', 'badge-warning'],
    ['red', 'badge-error'],
  ];

  for (const [color, status] of colorStatus) {
    it(`should display the ${status} status when the label color is ${color}`, () => {
      const label = getLabelMock({ name: 'Major Stuff', color });

      fixture.componentRef.setInput('label', label);
      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector(`.${status}`);
      expect(badge).toBeTruthy();
    });
  }
});
