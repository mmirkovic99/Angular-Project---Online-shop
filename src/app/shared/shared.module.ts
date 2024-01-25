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
import { DiscountPipe } from '../pipes/discount.pipe';
import { SortPipe } from '../pipes/sort.pipe';
import { ChatBotComponent } from './components/chat-bot/chat-bot.component';
import { ProductTypePipe } from '../pipes/type.pipe';
import { SvgIconComponent } from './components/svg-icon/svg-icon.component';
import { TypingIndicatorComponent } from './components/typing-indicator/typing-indicator.component';
import { MessageSenderPipe } from '../pipes/messageSender.pipe';
import { FormatTimePipe } from '../pipes/formatTime.pipe';
import { LoaderComponent } from './components/loader/loader.component';
import { OrdersButtonComponent } from './components/orders-button/orders-button.component';
import { ProductLinkComponent } from './ag-grid/product-link/product-link.component';
import { ProductImageComponent } from './ag-grid/product-image/product-image.component';
import { ProductTimeComponent } from './ag-grid/product-time/product-time.component';
import { ProductTotalPriceComponent } from './ag-grid/product-total-price/product-total-price.component';
import { ProductNumberComponent } from './ag-grid/product-number/product-number.component';
import { ProductQuantityComponent } from './ag-grid/product-quantity/product-quantity.component';

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
    DiscountPipe,
    SortPipe,
    ChatBotComponent,
    ProductTypePipe,
    SvgIconComponent,
    TypingIndicatorComponent,
    MessageSenderPipe,
    FormatTimePipe,
    LoaderComponent,
    OrdersButtonComponent,
    ProductLinkComponent,
    ProductImageComponent,
    ProductTimeComponent,
    ProductTotalPriceComponent,
    ProductNumberComponent,
    ProductQuantityComponent,
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
    DiscountPipe,
    SortPipe,
    ChatBotComponent,
    ProductTypePipe,
    SvgIconComponent,
    MessageSenderPipe,
    FormatTimePipe,
    LoaderComponent,
    ProductLinkComponent,
    ProductImageComponent,
    ProductTimeComponent,
    ProductTotalPriceComponent,
    ProductNumberComponent,
  ],
})
export class SharedModule {}
