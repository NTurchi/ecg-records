import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { signal } from '@angular/core';
import { fireEvent, getByPlaceholderText, getByRole } from '@testing-library/dom';

import { EcgFiltersComponent } from './ecg-filters.component';

import { getLabelMockList } from '../../../../mocks/label.mock';
import { Label } from '../../../../core';
import { EcgsStore } from '../../stores/ecgs.store';

describe('EcgFiltersComponent', () => {
  let fixture: ComponentFixture<EcgFiltersComponent>;

  const labels = signal<Label[]>([]);
  const ecgStoreMock = {
    labels,
    updateFilters: (..._args: any[]) => {},
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcgFiltersComponent],
      providers: [{ provide: EcgsStore, useValue: ecgStoreMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(EcgFiltersComponent);
  });

  afterEach(() => {
    labels.set([]);
  });

  it('should renders a search input', () => {
    fixture.detectChanges();
    const input = getByPlaceholderText<HTMLInputElement>(fixture.nativeElement, 'Search ECGs...');
    expect(input).toBeTruthy();
  });

  it('should renders a label filter with all labels', async () => {
    labels.set(getLabelMockList());
    fixture.detectChanges();

    const labelsFilterButton = getByRole(fixture.nativeElement, 'button', {
      name: 'Filter by Labels',
    });
    expect(labelsFilterButton).toBeTruthy();

    for (const label of labels()) {
      const labelItem = getByRole(fixture.nativeElement, 'checkbox', { name: label.name });
      expect(labelItem).toBeTruthy();
    }
  });

  it('should triggers a filter event when a label is selected', fakeAsync(() => {
    labels.set(getLabelMockList());
    const labelToSelect = labels()[0];
    const spy = spyOn(ecgStoreMock, 'updateFilters');

    fixture.detectChanges();
    const labelCheckbox = getByRole<HTMLInputElement>(fixture.nativeElement, 'checkbox', {
      name: labelToSelect.name,
    });
    labelCheckbox.click();
    tick(500);

    expect(spy).toHaveBeenCalledOnceWith({
      labelIds: [labelToSelect.id],
      patientFullName: '',
    });
  }));

  it('should triggers a search event when the search input changes', fakeAsync(() => {
    const spy = spyOn(ecgStoreMock, 'updateFilters');
    fixture.detectChanges();

    const searchInput = getByPlaceholderText<HTMLInputElement>(
      fixture.nativeElement,
      'Search ECGs...'
    );
    fireEvent.keyUp(searchInput, { target: { value: 'John Doe' } });
    tick(500);

    expect(spy).toHaveBeenCalledOnceWith({
      labelIds: [],
      patientFullName: 'John Doe',
    });
  }));
});
