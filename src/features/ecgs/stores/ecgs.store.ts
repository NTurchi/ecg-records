import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { Ecg, EcgSearchFilters, EcgService, Label, LabelService } from '../../../core';
import { computed, inject } from '@angular/core';

type EcgsState = {
  filter: EcgSearchFilters;
};

// _ecg is used for any optimistic updates
const initialState: EcgsState & { _ecgs: Record<string, Ecg> } = {
  filter: {},
  _ecgs: {},
};

export const EcgsStore = signalStore(
  withState(initialState),
  withProps(store => {
    const ecgService = inject(EcgService);
    const labelService = inject(LabelService);

    return {
      getEcgs: ecgService.getEcgs(store.filter),
      updateEcg: ecgService.updateEcg,
      getLabels: labelService.getLabels(),
    };
  }),
  withComputed(store => ({
    loading: computed(() => store.getEcgs.isLoading() || store.getLabels.isLoading()),
    error: computed(() => store.updateEcg.isError()),
    // Merge the data from the server with the optimistic updates
    ecgs: computed(() => store.getEcgs.data() || []),
    labels: computed(() => store.getLabels.data() || []),
    labelById: computed<Record<string, Label>>(() =>
      (store.getLabels.data() || []).reduce((acc, label) => ({ ...acc, [label.id]: label }), {})
    ),
  })),
  withMethods(store => ({
    updateFilter(filter: EcgSearchFilters) {
      patchState(store, { filter });
    },
    updateLabelOnEcg(ecgId: string, labelId: string) {
      store.updateEcg.mutate({ ecgId, ecg: { labelId } });
    },
  }))
);
