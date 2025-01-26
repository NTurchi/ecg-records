import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getByText } from '@testing-library/dom';
import { signal } from '@angular/core';

import { EcgCardComponent } from './ecg-card.component';
import { getEcgMock } from '../../../../mocks/ecg.mock';
import { getLabelMock } from '../../../../mocks/label.mock';
import { EcgsStore } from '../../stores/ecgs.store';

describe('EcgCardComponent', () => {
  let fixture: ComponentFixture<EcgCardComponent>;

  const label = getLabelMock({ id: 'test', name: "We're Hiring !" });
  const ecg = getEcgMock({ patientFullName: 'John Doe', labelId: label.id });

  const labels = signal([label, getLabelMock()]);

  const ecgStoreMock = {
    labelById: signal(() => ({ [label.id]: label })),
    labels,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcgCardComponent],
      providers: [
        {
          provide: EcgsStore,
          useValue: ecgStoreMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EcgCardComponent);

    fixture.componentRef.setInput('ecg', ecg);
  });

  it('should display the patient full name', () => {
    fixture.detectChanges();
    const patientFullName = getByText(fixture.nativeElement, 'John Doe');

    expect(patientFullName).toBeTruthy();
  });

  it('should display the correct label', () => {
    fixture.detectChanges();
    const labelName = getByText(fixture.nativeElement, label.name);

    expect(labelName).toBeTruthy();
  });
});
