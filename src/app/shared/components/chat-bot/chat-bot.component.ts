import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription, forkJoin, timer } from 'rxjs';
import { debounce, debounceTime, delay, mergeMap } from 'rxjs/operators';
import { AppStateInterface } from 'src/app/models/appState.interface';
import { ChatbotInterface } from 'src/app/models/chatbot.interface';
import { MessageInterface } from 'src/app/models/message.interface';
import { ProductInterface } from 'src/app/models/product.interface';
import { ChatbotService } from 'src/app/services/chatbot.service';
import * as CartAction from '../../../store/actions/CartActions';
import { ProductService } from 'src/app/services/product.service';
import { Tags } from '../../../constants/chatbot.constants';
import { CartService } from 'src/app/services/cart.service';
import { ProductInCartInterface } from 'src/app/models/cartState.interface';

@Component({
  selector: 'chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.scss'],
})
export class ChatBotComponent
  implements OnInit, AfterViewChecked, AfterViewInit, OnDestroy
{
  @ViewChild('messageContainer') messageContainer!: ElementRef;
  private scrollPosition = 0;
  private isNewMessage = false;
  messages: MessageInterface[] = [];
  subscriptions: Subscription[] = [];
  messageForm!: FormGroup;
  questions!: ChatbotInterface[];
  tag!: string;

  isDialogOpen: boolean = false;
  isChatbotWriting: boolean = false;
  isLastMessageSeen: boolean = false;

  private productOrdinalNumber: number = -1;
  private size: number = 0;
  private selectedProduct: ProductInterface | undefined;
  private latestDisplayedProducts: ProductInterface[] | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private chatbotService: ChatbotService,
    private productService: ProductService,
    private router: Router,
    private store: Store<AppStateInterface>,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.messageForm = this.buildForm();
    this.subscriptions.push(this.getInitialMessage());
  }

  ngAfterViewChecked(): void {
    if (this.isNewMessage) this.scrollToBottom();
  }
  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.unsubscribe();
  }
  getFormControl(name: string): FormControl {
    return this.messageForm.get(name) as FormControl;
  }

  seeMessages(): void {
    this.isDialogOpen = !this.isDialogOpen;
    this.isLastMessageSeen = true;
  }

  sendMessage(): void {
    let message: string = this.getFormControl('message').value;
    if (message.trim() === '') return;
    this.isNewMessage = true;
    if (message.includes('Select product')) {
      this.productOrdinalNumber = Number(
        message.slice(message.indexOf('#') + 1)
      );
      this.addMessage({
        sender: 'user',
        content: message,
      });
      message = message.slice(0, message.indexOf('#') - 1);
    } else if (message.includes('Choose size')) {
      this.size = Number(message.slice(message.lastIndexOf(' ')));
      this.addMessage({
        sender: 'user',
        content: message,
      });
      message = message.slice(0, message.indexOf(' ') - 1);
    } else
      this.addMessage({
        sender: 'user',
        content: message,
      });
    this.isChatbotWriting = true;

    this.getFormControl('message').setValue('');
    this.subscriptions.push(this.handleChatbotResponse(message));
  }

  handleKeypress(event: any): void {
    if (event.charCode === 13) this.sendMessage();
  }

  navigateProduct(productId: number): void {
    this.router.navigate([`product/${productId}`]);
  }
  private handleScroll(event: any): void {
    (event as Event).stopPropagation();
  }

  private getTag(): string {
    return this.tag;
  }

  private setTag(tag: string) {
    this.tag = tag;
  }

  private getSize(): number {
    return this.size;
  }

  private setSize(size: number): void {
    this.size = size;
  }

  private scrollToBottom(): void {
    (this.messageContainer.nativeElement as HTMLElement).scrollTop = (
      this.messageContainer.nativeElement as HTMLElement
    ).scrollHeight;
  }

  private buildForm(): FormGroup {
    return this.formBuilder.group({
      message: [''],
    });
  }

  private addMessage(message: MessageInterface): void {
    message.time = new Date();
    this.messages.push(message);
  }

  private getInitialMessage(): Subscription {
    return this.chatbotService
      .getResponseByTag(Tags.GREETING)
      .subscribe((message: MessageInterface) => {
        this.addMessage(message);
      });
  }

  private handleProductInfoTag(
    message: string
  ): Observable<[ProductInterface[], MessageInterface]> {
    return forkJoin([
      this.productService.getProductByTitle(message),
      this.chatbotService.getResponseByTag(Tags.PRODUCT_INFO),
    ]);
  }

  private handleBrandInfoTag(
    message: string
  ): Observable<[ProductInterface[], MessageInterface]> {
    return forkJoin([
      this.productService.getProductsByCompany(message),
      this.chatbotService.getResponseByTag(Tags.BRAND_INFO),
    ]);
  }

  private handleProductSelectionTag(
    products: ProductInterface[] | undefined
  ): Observable<MessageInterface> {
    this.setTag(
      !products || this.productOrdinalNumber >= products.length
        ? Tags.DEFAULT
        : this.tag
    );
    return this.chatbotService.getResponseByTag(this.tag);
  }

  private handleProductSizeSelectionTag(
    product: ProductInterface | undefined
  ): Observable<MessageInterface> {
    if (typeof product === 'undefined') this.setTag(Tags.DEFAULT);
    const isSizeAvailable = product?.sizes.some(
      (size: number) => size === this.size
    );
    return this.chatbotService.getResponseByTag(this.tag, isSizeAvailable);
  }

  private handleAddToCartTag(size: number): Observable<MessageInterface> {
    this.setTag(size === 0 ? Tags.DEFAULT : this.tag);
    return this.chatbotService.getResponseByTag(this.tag);
  }

  private handleProductNavigationTag(product: ProductInterface | undefined) {
    this.setTag(!product ? Tags.DEFAULT : this.tag);
    return this.chatbotService.getResponseByTag(this.tag);
  }

  private handleUserMessageTag(message: string) {
    switch (this.tag) {
      case Tags.PRODUCT_INFO:
        return this.handleProductInfoTag(message);
      case Tags.BRAND_INFO:
        return this.handleBrandInfoTag(message);
      case Tags.PRODUCT_SELECTION:
        return this.handleProductSelectionTag(this.latestDisplayedProducts);
      case Tags.PRODUCT_SIZE_SELECTION:
        return this.handleProductSizeSelectionTag(this.selectedProduct);
      case Tags.ADD_TO_CART:
        return this.handleAddToCartTag(this.size);
      case Tags.PRODUCT_NAVIGATION:
        return this.handleProductNavigationTag(this.selectedProduct);
      default:
        return this.chatbotService.getResponseByTag(this.tag);
    }
  }

  private handleProductSelectionResponse(
    message: MessageInterface,
    product: ProductInterface | undefined
  ): void {
    message.content = `${message.content} ${this.productOrdinalNumber}`;
    this.selectedProduct = product;
    this.setSize(0);
  }

  private handleProductSizeSelectionResponse(message: MessageInterface): void {
    message.content = message.content.replace(/\$/g, `${this.size}`);
  }

  private handleAddToCartResponse(message: MessageInterface): void {
    message.content = message.content.replace(
      /\$/g,
      `${this.productOrdinalNumber}`
    );

    let productToAdd = Object.assign({}, this.selectedProduct);
    productToAdd = { ...productToAdd, sizes: [this.size] };
    const productToOrder: ProductInCartInterface = {
      product: productToAdd,
      quantity: 1,
    };
    this.store.dispatch(CartAction.addToCart({ product: productToOrder }));
    // this.cartService.addToCart(productToAdd);
  }

  private handleBrandInfoResponse(
    message: MessageInterface,
    products: ProductInterface[]
  ): void {
    message.content += `${products.length} product${
      products.length !== 1 ? 's' : ''
    } with from that brand`;
  }

  private handleProductInfoResponse(
    message: MessageInterface,
    products: ProductInterface[]
  ): void {
    message.content += `${products.length} color${
      products.length !== 1 ? 's' : ''
    }`;
  }

  private handleChatbotResponse(message: string): Subscription {
    return this.chatbotService
      .getTagByInput(message)
      .pipe(
        delay(2000),
        mergeMap((tag: string) => {
          this.setTag(tag);
          return this.handleUserMessageTag(message);
        })
      )
      .subscribe((result) => {
        this.isChatbotWriting = false;
        this.isLastMessageSeen = this.isDialogOpen ? true : false;
        if (!Array.isArray(result)) {
          const newMessage = result as MessageInterface;
          if (this.tag === Tags.PRODUCT_SELECTION) {
            this.handleProductSelectionResponse(
              newMessage,
              this.latestDisplayedProducts?.[this.productOrdinalNumber]
            );
          }
          if (this.tag === Tags.PRODUCT_SIZE_SELECTION) {
            this.handleProductSizeSelectionResponse(newMessage);
          }
          if (this.tag === Tags.ADD_TO_CART) {
            this.handleAddToCartResponse(newMessage);
          }
          if (this.tag === Tags.PRODUCT_NAVIGATION) {
            this.router.navigate([`product/${this.selectedProduct?.id}`]);
          }
          this.addMessage(newMessage);
        } else {
          const [products, message]: [ProductInterface[], MessageInterface] =
            result;
          if (this.tag === Tags.BRAND_INFO) {
            this.handleBrandInfoResponse(message, products);
          } else {
            this.handleProductInfoResponse(message, products);
          }

          message.productsInfo = products;
          this.latestDisplayedProducts = products;
          this.addMessage(message);

          setTimeout(() => (this.isNewMessage = false));
        }
      });
  }

  private unsubscribe(): void {
    this.subscriptions.forEach((subscription: Subscription) =>
      subscription.unsubscribe()
    );
  }
}
