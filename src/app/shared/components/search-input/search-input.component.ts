import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  switchMap,
  debounce,
  debounceTime,
  distinctUntilChanged,
  distinct,
  map,
} from 'rxjs/operators';
import { ProductInterface } from 'src/app/models/product.interface';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
})
export class SearchInputComponent implements OnInit, OnDestroy {
  searchForm!: FormGroup;
  searchResults: ProductInterface[] | null = null;
  searchResultsSubscription?: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.buildForm();
    this.setSearchResult();
  }

  ngOnDestroy(): void {
    this.searchResultsSubscription?.unsubscribe();
  }

  buildForm(): void {
    this.searchForm = this.formBuilder.group({
      searchTerm: [''],
    });
  }

  setSearchResult() {
    this.searchResultsSubscription = this.searchForm.valueChanges
      .pipe(
        map((data: any) => data.searchTerm.trim()),
        distinctUntilChanged((prev, curr) => prev === curr),
        debounceTime(1000),
        switchMap((title: string) => {
          return this.productService.searchProducts(title);
        })
      )
      .subscribe((searchResults: ProductInterface[]) => {
        if (
          searchResults.length === 0 ||
          this.getFormControl('searchTerm').value.trim() === ''
        )
          this.searchResults = null;
        else this.searchResults = searchResults;
      });
  }

  showProductPage(id: number) {
    this.searchResults = null;
    this.router.navigate([`/product/${id}`]);
  }

  private getFormControl(name: string): FormControl {
    return this.searchForm.get(name) as FormControl;
  }
}
