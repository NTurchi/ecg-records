import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { EcgsStore } from './ecgs.store';
import {
  Ecg,
  Label,
  EcgService,
  LabelService,
  getSuccessQueryMock,
  getMutationQueryMock,
} from '../../../core';
import { getEcgListMock } from '../../../mocks/ecg.mock';
import { getLabelMockList } from '../../../mocks/label.mock';

describe('EcgsStore', () => {
  const ecgs = signal<Ecg[]>([]);
  const labels = signal<Label[]>([]);

  const ecgsQuery = getSuccessQueryMock(ecgs);
  const updateEcgMutationQuery = getMutationQueryMock<Ecg, { ecgId: string; ecg: Partial<Ecg> }>();
  const ecgServiceMock: Partial<EcgService> = {
    getEcgs: () => ecgsQuery,
    updateEcg: updateEcgMutationQuery,
  };

  const labelsQuery = getSuccessQueryMock(labels);
  const labelServiceMock: Partial<LabelService> = {
    getLabels: () => labelsQuery,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EcgsStore,
        { provide: EcgService, useValue: ecgServiceMock },
        { provide: LabelService, useValue: labelServiceMock },
      ],
    });
  });

  afterEach(() => {
    ecgs.set([]);
    labels.set([]);
  });

  describe('ecgs', () => {
    it('should return the list of ecgs', () => {
      const ecgsStore = TestBed.inject(EcgsStore);
      ecgs.set(getEcgListMock(2));

      expect(ecgsStore.ecgs()).toEqual(ecgs());
    });

    it('should update filters', () => {
      const ecgsStore = TestBed.inject(EcgsStore);

      const filters = { patientFullName: 'John Doe' };

      ecgsStore.updateFilters(filters);

      expect(ecgsStore.filters()).toEqual(filters);
    });
  });

  describe('error handling', () => {
    it('should set the based on query errors', () => {
      const ecgsStore = TestBed.inject(EcgsStore);
      spyOn(updateEcgMutationQuery, 'isError').and.returnValue(true);

      expect(ecgsStore.hasError()).toBeTrue();
    });
  });

  describe('labels', () => {
    it('should return the list of labels', () => {
      const ecgsStore = TestBed.inject(EcgsStore);
      labels.set(getLabelMockList());

      expect(ecgsStore.labels()).toEqual(labels());
    });

    it('should return labels by id', () => {
      const ecgsStore = TestBed.inject(EcgsStore);
      labels.set(getLabelMockList());

      const labelById = labels().reduce((acc, label) => ({ ...acc, [label.id]: label }), {});

      expect(ecgsStore.labelById()).toEqual(labelById);
    });
  });

  describe('isLoading', () => {
    it('should return false if ecgs and labels are not loading', () => {
      const ecgsStore = TestBed.inject(EcgsStore);

      spyOn(ecgsQuery, 'isLoading').and.returnValue(false);
      spyOn(labelsQuery, 'isLoading').and.returnValue(false);

      expect(ecgsStore.isLoading()).toBeFalse();
    });

    it('should return true if ecgs are loading', () => {
      const ecgsStore = TestBed.inject(EcgsStore);

      spyOn(ecgsQuery, 'isLoading').and.returnValue(true);
      spyOn(labelsQuery, 'isLoading').and.returnValue(false);

      expect(ecgsStore.isLoading()).toBeTrue();
    });

    it('should return true if labels are loading', () => {
      const ecgsStore = TestBed.inject(EcgsStore);

      spyOn(ecgsQuery, 'isLoading').and.returnValue(false);
      spyOn(labelsQuery, 'isLoading').and.returnValue(true);

      expect(ecgsStore.isLoading()).toBeTrue();
    });
  });
});
