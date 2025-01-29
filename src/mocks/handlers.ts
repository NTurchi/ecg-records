import { delay, http, HttpResponse } from 'msw';

import { Ecg } from '../core';
import { getEcgListMock } from './ecg.mock';
import { getLabelMockList } from './label.mock';

// use a closure to keep the ecg list in memory
const initEcgDb = () => {
  let ecgs: Ecg[] = [];
  return () => {
    if (ecgs.length) return ecgs;
    ecgs = getEcgListMock(10);
    return ecgs;
  };
};

// generate error response every n request
const errorDb = (requestBeforeError: number) => {
  let requestCount = 0;

  return () => {
    requestCount++;
    if (requestCount === requestBeforeError) {
      requestCount = 0;
      return true;
    }
    return false;
  };
};

const ecgDb = initEcgDb();
const error = errorDb(4); // error every 4 requests

export const handlers = [
  // ECGS
  http.get('/api/ecgs', async ({ request }) => {
    await delay(500);

    const url = new URL(request.url);
    const patientFullName = url.searchParams.get('patient_full_name');
    const labelIds = url.searchParams.getAll('label_ids');

    let ecgs = ecgDb();

    if (patientFullName) {
      ecgs = ecgs.filter(ecg => ecg.patientFullName.includes(patientFullName));
    }
    if (labelIds.length > 0) {
      ecgs = ecgs.filter(ecg => labelIds.includes(ecg.labelId));
    }

    return HttpResponse.json(ecgs);
  }),
  http.patch('/api/ecgs/:id', async ({ request, params }) => {
    const ecgId = params['id'];
    const body = (await request.json()) as { label_id: string };
    const label_id = body.label_id;

    const shouldReturnError = error();
    if (shouldReturnError) {
      return HttpResponse.error();
    }

    ecgDb().forEach(ecg => {
      if (ecg.id === ecgId) {
        ecg.labelId = label_id;
      }
    });

    return HttpResponse.json(ecgDb().find(ecg => ecg.id === ecgId));
  }),

  // LABELS
  http.get('/api/labels', () => HttpResponse.json(getLabelMockList())),
];
