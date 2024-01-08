import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'productType',
})
export class ProductTypePipe implements PipeTransform {
  transform(value: number): string {
    switch (value) {
      case 0:
        return "Men's shoes";
      case 1:
        return "Women's shoes ";
      default:
        return "Kid's shoes";
    }
  }
}
