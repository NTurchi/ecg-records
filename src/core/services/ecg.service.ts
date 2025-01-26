import { Injectable, resource, Signal } from '@angular/core';

import { Ecg, EcgSearchFilters } from './../models/ecg.model';

@Injectable({ providedIn: 'root' })
export class EcgService {
  #buildEcgsUrl(searchFilters: EcgSearchFilters): URL {
    const url = new URL(`/api/ecgs`, window.location.origin);

    if (searchFilters.patientFullName) {
      url.searchParams.append('patient_full_name', searchFilters.patientFullName);
    }

    if (searchFilters.labelIds?.length) {
      url.searchParams.append('label_ids', searchFilters.labelIds.join(','));
    }

    return url;
  }

  getEcgs(searchFilters: Signal<EcgSearchFilters>) {
    return resource({
      request: () => ({ queryParams: searchFilters() }),
      loader: async ({ request, abortSignal }): Promise<Ecg[]> => {
        const url = this.#buildEcgsUrl(request.queryParams);
        return fetch(url, { signal: abortSignal }).then(
          response => response.json() as Promise<Ecg[]>
        );
      },
    });
  }

  updateEcg(ecgId: string, ecg: Partial<Ecg>) {
    const request = new Request(`/api/ecgs/${ecgId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        label_id: ecg.labelId,
      }),
    });
    fetch(request);
  }
}
