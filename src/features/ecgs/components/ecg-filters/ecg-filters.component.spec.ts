import { ComponentFixture, TestBed } from '@angular/core/testing';
import { fireEvent, getByPlaceholderText, getByRole } from '@testing-library/dom';

import { EcgFiltersComponent } from './ecg-filters.component';
import { getLabelMockList } from '../../../../mocks/label.mock';

describe('EcgFiltersComponent', () => {
  let fixture: ComponentFixture<EcgFiltersComponent>;
  let component: EcgFiltersComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcgFiltersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EcgFiltersComponent);
    component = fixture.componentInstance;

    // use default inputs
    fixture.componentRef.setInput('labels', []);
  });

  it('should renders a search input', () => {
    fixture.detectChanges();
    const input = getByPlaceholderText<HTMLInputElement>(fixture.nativeElement, 'Search ECGs...');
    expect(input).toBeTruthy();
  });

  it('should renders a label filter with all labels', async () => {
    const labels = getLabelMockList();
    fixture.componentRef.setInput('labels', labels);
    fixture.detectChanges();

    const labelsFilterButton = getByRole(fixture.nativeElement, 'button', {
      name: 'Filter by Labels',
    });
    expect(labelsFilterButton).toBeTruthy();

    for (const label of labels) {
      const labelItem = getByRole(fixture.nativeElement, 'checkbox', { name: label.name });
      expect(labelItem).toBeTruthy();
    }
  });

  it('should triggers a filter event when a label is selected', () => {
    const labels = getLabelMockList();
    const labelToSelect = labels[0];
    const spyEmit = spyOn(component.filtersChange, 'emit');

    fixture.componentRef.setInput('labels', labels);
    fixture.detectChanges();

    const labelCheckbox = getByRole<HTMLInputElement>(fixture.nativeElement, 'checkbox', {
      name: labelToSelect.name,
    });
    labelCheckbox.click();

    expect(spyEmit).toHaveBeenCalledOnceWith({
      labelIds: [labelToSelect.id],
      patientFullName: '',
    });
  });

  it('should triggers a search event when the search input changes', () => {
    const spyEmit = spyOn(component.filtersChange, 'emit');

    fixture.detectChanges();
    const searchInput = getByPlaceholderText<HTMLInputElement>(
      fixture.nativeElement,
      'Search ECGs...'
    );

    fireEvent.keyUp(searchInput, { target: { value: 'John Doe' } });

    expect(spyEmit).toHaveBeenCalledOnceWith({
      labelIds: [],
      patientFullName: 'John Doe',
    });
  });
});
