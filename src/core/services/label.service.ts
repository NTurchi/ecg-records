import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

import { Label } from '../models';

@Injectable({ providedIn: 'root' })
export class LabelService {
  #httpClient = inject(HttpClient);

  getLabels() {
    return injectQuery(() => ({
      queryKey: ['labels'],
      queryFn: () => lastValueFrom(this.#httpClient.get<Label[]>('/api/labels')),
    }));
  }
}
