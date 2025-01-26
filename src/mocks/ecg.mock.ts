import { faker } from '@faker-js/faker';

import { Ecg } from '../core/models';
import { getLabelMockList } from './label.mock';

export const getEcgMock = (ecg?: Partial<Ecg>): Ecg => {
  const labels = getLabelMockList();
  const randomId = labels[faker.number.int({ min: 0, max: labels.length - 1 })].id;

  return {
    id: faker.string.uuid().slice(0, 8),
    patientFullName: faker.person.fullName(),
    recordTime: faker.date.recent(),
    labelId: randomId,
    ...ecg,
  };
};

export const getEcgListMock = (length: number): Ecg[] =>
  Array.from({ length }).map(() => getEcgMock());
