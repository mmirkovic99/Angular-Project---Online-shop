import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'discount',
})
export class DiscountPipe implements PipeTransform {
  transform(value1: number, value2: number): string {
    return `${(-(value2 / value1) * 100).toPrecision(2)}%`;
  }
}
