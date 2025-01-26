import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bg-color',
})
export class BgColorPipe implements PipeTransform {
  transform(value: string): string {
    return `bg-${value}-200`;
  }
}
