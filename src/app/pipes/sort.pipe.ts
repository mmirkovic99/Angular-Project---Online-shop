import { Pipe, PipeTransform } from '@angular/core';
import { ProductInterface } from '../models/product.interface';
import { SortingOptions } from '../constants/sort.constants';

@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {
  transform(products: ProductInterface[], option: string): ProductInterface[] {
    const convertOption = (option: string): SortingOptions => {
      switch (option) {
        case 'Name':
          return SortingOptions.NAME;
        case 'Rating':
          return SortingOptions.RATING;
        case 'The Highest Price':
          return SortingOptions.PRICE_DESC;
        case 'The Lowest Price':
          return SortingOptions.PRICE_ASC;
        default:
          return SortingOptions.NONE;
      }
    };

    const sortingOption: SortingOptions = convertOption(option);

    if (sortingOption === SortingOptions.NONE) return products;

    const sortFunction = (a: ProductInterface, b: ProductInterface): number => {
      switch (sortingOption) {
        case SortingOptions.NAME:
          return a.title.localeCompare(b.title);
        case SortingOptions.RATING:
          return b.rating - a.rating;
        case SortingOptions.PRICE_ASC:
          return a.price - b.price;
        default:
          return b.price - a.price;
      }
    };

    return products.slice().sort(sortFunction);
  }
}
