import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getByText } from '@testing-library/dom';

import { EcgCardComponent } from './ecg-card.component';
import { getEcgMock } from '../../../../mocks/ecg.mock';
import { getLabelMock } from '../../../../mocks/label.mock';

describe('EcgCardComponent', () => {
  let fixture: ComponentFixture<EcgCardComponent>;

  const label = getLabelMock({ name: "We're Hiring !" });
  const ecg = getEcgMock({ patientFullName: 'John Doe', labelId: label.id });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcgCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EcgCardComponent);

    fixture.componentRef.setInput('ecg', ecg);
    fixture.componentRef.setInput('label', getLabelMock());
    fixture.componentRef.setInput('labels', [label]);
  });

  it('should display the patient full name', () => {
    fixture.detectChanges();
    const patientFullName = getByText(fixture.nativeElement, 'John Doe');

    expect(patientFullName).toBeTruthy();
  });

  it('should display the correct label', () => {
    fixture.detectChanges();
    const labelName = getByText(fixture.nativeElement, "We're Hiring !");

    expect(labelName).toBeTruthy();
  });
});
