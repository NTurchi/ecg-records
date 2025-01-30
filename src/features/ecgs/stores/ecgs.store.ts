import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { EcgSearchFilters, EcgService, Label, LabelService } from '../../../core';
import { computed, inject } from '@angular/core';

type EcgsState = {
  filters: EcgSearchFilters;
};

const initialState: EcgsState = {
  filters: {},
};

export const EcgsStore = signalStore(
  withState(initialState),
  withProps(store => {
    const ecgService = inject(EcgService);
    const labelService = inject(LabelService);

    return {
      _getEcgs: ecgService.getEcgs(store.filters),
      _updateEcg: ecgService.updateEcg,
      _getLabels: labelService.getLabels(),
    };
  }),
  withComputed(store => ({
    isLoading: computed(() => store._getEcgs.isLoading() || store._getLabels.isLoading()),
    hasError: computed(
      () => store._updateEcg.isError() || store._getEcgs.isError() || store._getLabels.isError()
    ),
    ecgs: computed(() => store._getEcgs.data() || []),
    labels: computed(() => store._getLabels.data() || []),
    labelById: computed<Record<string, Label>>(() =>
      (store._getLabels.data() || []).reduce((acc, label) => ({ ...acc, [label.id]: label }), {})
    ),
  })),
  withMethods(store => ({
    updateFilters(filters: EcgSearchFilters) {
      patchState(store, { filters });
    },
    updateLabelOnEcg(ecgId: string, labelId: string) {
      store._updateEcg.mutate({ ecgId, ecg: { labelId } });
    },
  }))
);
