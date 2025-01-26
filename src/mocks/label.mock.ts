import { Label } from '../core/models';

export const getLabelMock = (label?: Partial<Label>): Label => ({
  id: '2f55rgt1',
  color: 'red',
  name: 'Major Aarrhythmia',
  ...label,
});

export const getLabelMockList = (): Label[] => [
  getLabelMock(),
  getLabelMock({ id: '12ds32gd', name: 'Minor Aarrhythmia', color: 'yellow' }),
  getLabelMock({ id: '64n232n2', name: 'Healthy', color: 'green' }),
];
