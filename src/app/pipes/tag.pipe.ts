import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tagType',
})
export class TagPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'Popular':
        return 'product__tag--popular';
      case 'New':
        return 'product__tag--new';
      default:
        return 'product__tag--on-sale';
    }
  }
}
