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
  #currentSearchQuery?: EcgSearchFilters;

  #fromSearchFiltersToHttpParams(searchFilters?: EcgSearchFilters): HttpParams | undefined {
    if (!searchFilters) return undefined;

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
      queryFn: () => {
        this.#currentSearchQuery = searchFilters?.();
        return lastValueFrom(
          this.#httpClient.get<Ecg[]>('/api/ecgs', {
            params: this.#fromSearchFiltersToHttpParams(searchFilters?.()),
          })
        );
      },
    }));
  }

  updateEcg = injectMutation(() => ({
    retry: false,
    mutationFn: (args: { ecgId: string; ecg: Partial<Ecg> }) =>
      lastValueFrom(
        this.#httpClient.patch<Ecg>(`/api/ecgs/${args.ecgId}`, {
          label_id: args.ecg.labelId,
        })
      ),
    onMutate: args => {
      // optimistic update
      this.#queryClient.setQueryData<Ecg[]>(['ecgs', this.#currentSearchQuery], (ecgs = []) =>
        ecgs.map(ecg => {
          if (ecg.id === args.ecgId) {
            return { ...ecg, ...args.ecg };
          }
          return ecg;
        })
      );
    },
    onSettled: () => this.#queryClient.invalidateQueries({ queryKey: ['ecgs'] }),
  }));
}
