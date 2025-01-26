import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EcgsComponent } from './ecgs.component';
import { signal } from '@angular/core';
import { getByRole } from '@testing-library/dom';

import {
  Ecg,
  EcgService,
  Label,
  LabelService,
  getMutationQueryMock,
  getSuccessQueryMock,
} from '../../core';
import { getEcgListMock } from '../../mocks/ecg.mock';

describe('EcgsComponent', () => {
  let fixture: ComponentFixture<EcgsComponent>;

  const ecgs = signal<Ecg[]>([]);
  const ecgsQuery = getSuccessQueryMock(ecgs);
  const updateEcgMutationQuery = getMutationQueryMock<Ecg, { ecgId: string; ecg: Partial<Ecg> }>();
  const ecgServiceMock: Partial<EcgService> = {
    getEcgs: () => ecgsQuery,
    updateEcg: updateEcgMutationQuery,
  };

  const labelServiceMock: Partial<LabelService> = {
    getLabels: () => getSuccessQueryMock<Label[]>(signal([])),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcgsComponent],
    })
      .overrideComponent(EcgsComponent, {
        remove: { providers: [EcgService, LabelService] },
        add: {
          providers: [
            { provide: EcgService, useValue: ecgServiceMock },
            { provide: LabelService, useValue: labelServiceMock },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(EcgsComponent);
  });

  afterEach(() => {
    ecgs.set([]);
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(EcgsComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should display the list of ECGs', () => {
    ecgs.set(getEcgListMock(3));

    fixture.detectChanges();

    for (let ecg of ecgs()) {
      const ecgCard = getByRole(fixture.nativeElement, 'heading', { name: ecg.patientFullName });
      expect(ecgCard).toBeTruthy();
    }
  });

  it('should trigger an optimistic update and a mutation when updating the label of an ecg', () => {
    ecgs.set(getEcgListMock(3));
    spyOn(updateEcgMutationQuery, 'mutateAsync');
    spyOn(fixture.componentInstance.ecgs, 'set');

    fixture.componentInstance.updateLabelOnEcg(ecgs()[0].id, 'labelId');

    // optimistic update before the mutation
    expect(fixture.componentInstance.ecgs.set).toHaveBeenCalledBefore(
      updateEcgMutationQuery.mutateAsync
    );
    expect(fixture.componentInstance.ecgs.set).toHaveBeenCalledWith([
      { ...ecgs()[0], labelId: 'labelId' },
      ...ecgs().slice(1, 3),
    ]);
    expect(updateEcgMutationQuery.mutateAsync).toHaveBeenCalledWith({
      ecgId: ecgs()[0].id,
      ecg: { labelId: 'labelId' },
    });
  });

  it('should update the search filters with a debounce when the filters change', fakeAsync(() => {
    spyOn(fixture.componentInstance.ecgSearchFilters, 'set');

    fixture.componentInstance.onFiltersChange({ patientFullName: 'John Doe' });

    expect(fixture.componentInstance.ecgSearchFilters.set).not.toHaveBeenCalled();

    tick(500);

    expect(fixture.componentInstance.ecgSearchFilters.set).toHaveBeenCalledWith({
      patientFullName: 'John Doe',
    });
  }));
});
