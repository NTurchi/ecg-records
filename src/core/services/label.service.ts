import { Injectable, resource } from '@angular/core';

import { Label } from '../models';

@Injectable({ providedIn: 'root' })
export class LabelService {
  getLabels() {
    return resource({
      loader: async (): Promise<Label[]> => {
        return fetch('/api/labels').then(response => response.json() as Promise<Label[]>);
      },
    });
  }
}
