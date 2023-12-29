import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
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
        switchMap((data: any) => {
          return this.productService.searchProducts(data.searchTerm);
        })
      )
      .subscribe((searchResults: ProductInterface[]) => {
        if (searchResults.length === 0) this.searchResults = null;
        else this.searchResults = searchResults;
      });
  }

  showProductPage(id: number) {
    this.searchResults = null;
    this.router.navigate([`/product/${id}`]);
  }
}
