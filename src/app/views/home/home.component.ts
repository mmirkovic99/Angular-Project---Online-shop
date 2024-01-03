import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { CompanyInterface } from 'src/app/models/company.interface';
import { ProductInterface } from 'src/app/models/product.interface';
import { CompanyService } from 'src/app/services/company.service';
import { ProductService } from 'src/app/services/product.service';
import { environment } from 'src/environments/environment';

enum Type {
  Man,
  Women,
  Kid,
}

enum SortingOptions {
  NAME,
  RATING,
  PRICEDESC,
  PRICEASC,
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  sortingOptions: string[] = environment.sortingOptions;
  selectedOption: string = 'None';

  companies!: CompanyInterface[];
  productList!: ProductInterface[];
  popularProducts!: ProductInterface[];
  filterForm!: FormGroup;

  currentPage: number = 0;
  itemsPerPage: number = 12;

  private subscriptions: Subscription[];

  constructor(
    private companyService: CompanyService,
    private productsService: ProductService,
    private formBuilder: FormBuilder
  ) {
    this.subscriptions = [];
  }

  ngOnInit(): void {
    this.filterForm = this.buildFilterForm();
    this.subscriptions.push(
      this.getAllCompanies(),
      this.getPopularProducts(),
      this.getAllProducts(),
      this.trackChangesForFilterForm(this.filterForm)
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  getFormGroup(name: string): FormGroup {
    return this.filterForm.get(name) as FormGroup;
  }

  getFormControl(formGroup: FormGroup, name: string): FormControl {
    return formGroup.get(name) as FormControl;
  }

  onSelectOption(option: string) {
    this.selectedOption = option;
    this.productList = this.sortProducts(this.selectedOption, this.productList);
  }

  private buildFilterForm(): FormGroup {
    return this.formBuilder.group({
      type: this.formBuilder.group({
        man: false,
        women: false,
        kid: false,
      }),
      company: this.formBuilder.group({
        nike: false,
        adidas: false,
      }),
    });
  }

  private getAllCompanies() {
    return this.companyService
      .getCompanies()
      .subscribe(
        (companies: CompanyInterface[]) => (this.companies = companies)
      );
  }

  private trackChangesForFilterForm(form: FormGroup): Subscription {
    return form.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged((prev, curr) => prev === curr),
        switchMap((filters) => {
          const selectedCompanies: string[] = this.getSelectedCompanies(
            filters.company
          );
          const selectedTypes: number[] = this.getSelectedTypes(filters.type);

          if (selectedCompanies.length > 0 && selectedTypes.length > 0) {
            return this.productsService.getFilteredProductsMix(
              selectedCompanies,
              selectedTypes
            );
          } else {
            if (selectedCompanies.length > 0)
              return this.productsService.getFilteredProducts(
                'companyName',
                selectedCompanies
              );
            else if (selectedTypes.length > 0) {
              return this.productsService.getFilteredProducts(
                'type',
                selectedTypes
              );
            }
            return this.productsService.getProducts();
          }
        })
      )
      .subscribe(
        (products: ProductInterface[]) => {
          this.productList =
            this.selectedOption === 'None'
              ? products
              : this.sortProducts(this.selectedOption, products);
        },
        (error) => console.error(error)
      );
  }

  private getSelectedCompanies(data: {
    [key: string]: boolean;
  }): Array<string> {
    return Object.keys(data)
      .filter((key) => data[key])
      .map((name: string) => name.charAt(0).toUpperCase() + name.slice(1));
  }

  private getSelectedTypes(data: { [key: string]: boolean }): Array<number> {
    function convertType(type: string): Type {
      switch (type) {
        case 'man':
          return Type.Man;
        case 'women':
          return Type.Women;
        default:
          return Type.Kid;
      }
    }
    return Object.keys(data)
      .filter((key) => data[key])
      .map((type: string) => convertType(type));
  }

  private getAllProducts(): Subscription {
    return this.productsService.getProducts().subscribe(
      (products: ProductInterface[]) => {
        this.productList = products;
      },
      (error) => console.error(error)
    );
  }

  private getPopularProducts(): Subscription {
    return this.productsService
      .getProductByTag('Popular')
      .subscribe(
        (products: ProductInterface[]) => (this.popularProducts = products)
      );
  }

  private sortProducts(option: string, products: ProductInterface[]) {
    function convertOption(option: string): SortingOptions {
      switch (option) {
        case 'Name':
          return SortingOptions.NAME;
        case 'Rating':
          return SortingOptions.RATING;
        case 'The Highest Price':
          return SortingOptions.PRICEDESC;
        default:
          return SortingOptions.PRICEASC;
      }
    }
    const sortByName = (products: ProductInterface[]): ProductInterface[] =>
      products.slice().sort((a, b) => a.title.localeCompare(b.title));

    const sortByRating = (products: ProductInterface[]): ProductInterface[] =>
      products.slice().sort((a, b) => b.rating - a.rating);

    const sortByPriceDESC = (
      products: ProductInterface[]
    ): ProductInterface[] => products.slice().sort((a, b) => b.price - a.price);

    const sortByPriceASC = (products: ProductInterface[]): ProductInterface[] =>
      products.slice().sort((a, b) => a.price - b.price);

    const sortingOption: SortingOptions = convertOption(option);
    switch (sortingOption) {
      case SortingOptions.NAME:
        return sortByName(products);
      case SortingOptions.RATING:
        return sortByRating(products);
      case SortingOptions.PRICEASC:
        return sortByPriceASC(products);
      default:
        return sortByPriceDESC(products);
    }
  }

  private unsubscribe() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
