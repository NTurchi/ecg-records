import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

import { Ecg, EcgSearchFilters } from './../models/ecg.model';

@Injectable({ providedIn: 'root' })
export class EcgService {
  #httpClient = inject(HttpClient);
  #queryClient = injectQueryClient();

  #fromSearchFiltersToHttpParams(searchFilters: EcgSearchFilters): HttpParams {
    const params: Record<string, string | string[]> = {};

    if (searchFilters.patientFullName) {
      params['patient_full_name'] = searchFilters.patientFullName;
    }

    if (searchFilters.labelIds?.length) {
      params['label_ids'] = searchFilters.labelIds;
    }

    return new HttpParams({ fromObject: params });
  }

  getEcgs(searchFilters?: Signal<EcgSearchFilters>) {
    return injectQuery(() => ({
      queryKey: ['ecgs', searchFilters?.()],
      staleTime: 0,
      queryFn: () =>
        lastValueFrom(
          this.#httpClient.get<Ecg[]>('/api/ecgs', {
            params: searchFilters && this.#fromSearchFiltersToHttpParams(searchFilters()),
          })
        ),
    }));
  }

  updateLabelOnEcg = injectMutation(() => ({
    retry: false,
    mutationFn: (args: { ecgId: string; labelId: string }) =>
      lastValueFrom(
        this.#httpClient.patch<Ecg>(`/api/ecgs/${args.ecgId}`, {
          label_id: args.labelId,
        })
      ),
    onSuccess: () => this.#queryClient.invalidateQueries({ queryKey: ['ecgs'] }),
  }));
}
