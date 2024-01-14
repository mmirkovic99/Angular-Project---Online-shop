import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
} from 'rxjs/operators';
import { Type } from 'src/app/constants/product.constants';
import { CompanyInterface } from 'src/app/models/company.interface';
import { ProductInterface } from 'src/app/models/product.interface';
import { CompanyService } from 'src/app/services/company.service';
import { ProductService } from 'src/app/services/product.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  sortingOptions: string[] = [
    'The Highest Price',
    'The Lowest Price',
    'Name',
    'Rating',
  ];
  selectedOption: string = 'None';

  companies!: CompanyInterface[];
  productList!: ProductInterface[];
  popularProducts!: ProductInterface[];
  filterForm!: FormGroup;

  currentPage: number = 0;
  itemsPerPage: number = 12;

  isLoadingProducts: boolean = false;

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

  private getAllCompanies(): Subscription {
    return this.companyService.getCompanies().subscribe(
      (companies: CompanyInterface[]) => (this.companies = companies),
      (error) => console.error(error)
    );
  }

  private trackChangesForFilterForm(form: FormGroup): Subscription {
    const compareInnerFormKeys = (
      outerKey: string,
      form1: any,
      form2: any
    ): boolean => {
      const innerFormKeys = Object.keys(form1[outerKey]);
      let match = true;
      for (let i = 0; i < innerFormKeys.length; i++) {
        const innerKey = innerFormKeys[i];
        if (form1[outerKey][innerKey] !== form2[outerKey][innerKey]) {
          match = false;
          break;
        }
      }
      return match;
    };

    const areFormsEqual = (form1: any, form2: any): boolean => {
      const outerFormKeys = Object.keys(form1);
      const typeMatch = compareInnerFormKeys(outerFormKeys[0], form1, form2);
      const companyMatch = compareInnerFormKeys(outerFormKeys[1], form1, form2);
      return typeMatch && companyMatch;
    };

    return form.valueChanges
      .pipe(
        map((filters) => {
          this.isLoadingProducts = true;
          this.productList = [];
          return filters;
        }),
        debounceTime(1000),
        distinctUntilChanged((prev, curr) => {
          return areFormsEqual(prev, curr);
        }),
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
          this.productList = products;
          this.currentPage = 0;
          this.isLoadingProducts = false;
        },
        (error) => console.error(error)
      );
  }

  private getSelectedCompanies(data: { [key: string]: boolean }): string[] {
    return Object.keys(data)
      .filter((key) => data[key])
      .map((name: string) => name.charAt(0).toUpperCase() + name.slice(1));
  }

  private getSelectedTypes(data: { [key: string]: boolean }): number[] {
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
    return this.productsService.getProductByTag('Popular').subscribe(
      (products: ProductInterface[]) => (this.popularProducts = products),
      (error) => console.error(error)
    );
  }

  private unsubscribe(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
