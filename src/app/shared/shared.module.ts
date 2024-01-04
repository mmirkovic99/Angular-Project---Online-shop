import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomButtonComponent } from './components/custom-button/custom-button.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { SliderComponent } from './components/slider/slider.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ProductCarouselComponent } from './components/product-carousel/product-carousel.component';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { CartButtonComponent } from './components/cart-button/cart-button.component';
import { FavoriteButtonComponent } from './components/favorite-button/favorite-button.component';
import { ProfileButtonComponent } from './components/profile-button/profile-button.component';
import { CustomSelectComponent } from './components/custom-select/custom-select.component';
import { TagPipe } from '../pipes/tag.pipe';
import { SalePipe } from '../pipes/sale.pipe';

@NgModule({
  declarations: [
    CustomInputComponent,
    CustomButtonComponent,
    NavbarComponent,
    FooterComponent,
    HeaderComponent,
    SliderComponent,
    ProductCardComponent,
    ProductCarouselComponent,
    SearchInputComponent,
    CartButtonComponent,
    FavoriteButtonComponent,
    ProfileButtonComponent,
    CustomSelectComponent,
    TagPipe,
    SalePipe,
  ],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [
    CustomInputComponent,
    CustomButtonComponent,
    NavbarComponent,
    FooterComponent,
    HeaderComponent,
    SliderComponent,
    ProductCardComponent,
    ProductCarouselComponent,
    SearchInputComponent,
    CartButtonComponent,
    FavoriteButtonComponent,
    ProfileButtonComponent,
    CustomSelectComponent,
    TagPipe,
    SalePipe,
  ],
})
export class SharedModule {}
