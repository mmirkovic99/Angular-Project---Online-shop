import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription, forkJoin } from 'rxjs';
import { mergeMap, switchMap } from 'rxjs/operators';
import { AppStateInterface } from 'src/app/models/appState.interface';
import { ChatbotFAQInterface } from 'src/app/models/chatbotFAQ.interface';
import { MessageInterface } from 'src/app/models/message.interface';
import { ProductInterface } from 'src/app/models/product.interface';
import { ChatbotService } from 'src/app/services/chatbot.service';
import * as CartAction from '../../../store/actions/CartActions';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.scss'],
})
export class ChatBotComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('messageContainer') messageContainer!: ElementRef;
  messages: MessageInterface[] = [];
  subscriptions: Subscription[] = [];
  messageForm!: FormGroup;
  questions!: ChatbotFAQInterface[];
  tag!: string;

  private productOrdinalNumber: number = -1;
  private size: number = 0;
  private selectedProduct: ProductInterface | undefined;
  private latestDisplayedProducts: ProductInterface[] | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private chatbotService: ChatbotService,
    private productService: ProductService,
    private router: Router,
    private store: Store<AppStateInterface>
  ) {}

  ngOnInit(): void {
    this.messageForm = this.buildForm();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }
  getFormControl(name: string): FormControl {
    return this.messageForm.get(name) as FormControl;
  }

  sendMessage(): void {
    let message: string = this.getFormControl('message').value;
    if (message.trim() === '') return;

    if (message.includes('Select product')) {
      this.productOrdinalNumber = Number(
        message.slice(message.indexOf('#') + 1)
      );
      this.addMessage({ sender: 'user', content: message });
      message = message.slice(0, message.indexOf('#') - 1);
    } else if (message.includes('Choose size')) {
      this.size = Number(message.slice(message.lastIndexOf(' ')));
      this.addMessage({ sender: 'user', content: message });
      message = message.slice(0, message.indexOf(' ') - 1);
    } else this.addMessage({ sender: 'user', content: message });

    this.getFormControl('message').setValue('');

    this.subscriptions.push(this.handleChatbotResponse(message));
  }

  navigateProduct(productId: number): void {
    this.router.navigate([`product/${productId}`]);
  }

  private scrollToBottom(): void {
    this.messageContainer.nativeElement.scrollTop =
      this.messageContainer.nativeElement.scrollHeight;
  }

  private buildForm(): FormGroup {
    return this.formBuilder.group({
      message: [''],
    });
  }

  private addMessage(message: MessageInterface): void {
    this.messages.push(message);
  }

  private handleChatbotResponse(message: string): Subscription {
    return this.chatbotService
      .getTagByInput(message)
      .pipe(
        mergeMap((tag: string) => {
          console.log(tag);
          this.tag = tag;
          if (this.tag === 'product_info') {
            return forkJoin([
              this.productService.getProductByTitle(message),
              this.chatbotService.getResponseByTag(this.tag),
            ]);
          } else if (this.tag === 'brand_info') {
            return forkJoin([
              this.productService.getProductsByCompany(message),
              this.chatbotService.getResponseByTag(this.tag),
            ]);
          } else if (this.tag === 'product_selection') {
            if (!this.latestDisplayedProducts) this.tag = 'default';
            return this.chatbotService.getResponseByTag(this.tag);
          } else if (this.tag === 'product_size_selection') {
            const isSizeAvailable = this.selectedProduct?.sizes.some(
              (size: number) => size === this.size
            );
            if (!isSizeAvailable) this.size = -1;
            return this.chatbotService.getResponseByTag(
              this.tag,
              isSizeAvailable
            );
          } else if (this.tag === 'add_to_cart') {
            if (this.size === 0) this.tag = 'default';
            return this.chatbotService.getResponseByTag(this.tag);
          } else if (this.tag === 'product_navigation') {
            if (!this.selectedProduct) this.tag = 'default';
            return this.chatbotService.getResponseByTag(this.tag);
          } else {
            return this.chatbotService.getResponseByTag(this.tag);
          }
        })
      )
      .subscribe((result) => {
        if (!Array.isArray(result)) {
          const newMessage = result as MessageInterface;
          if (this.tag === 'product_selection') {
            newMessage.content = `${newMessage.content} ${this.productOrdinalNumber}`;
            this.selectedProduct =
              this.latestDisplayedProducts?.[this.productOrdinalNumber];
            console.log(this.selectedProduct);
            this.size = 0;
          }
          if (this.tag === 'product_size_selection') {
            newMessage.content = newMessage.content.replace(
              /\$/g,
              `${this.size}`
            );
          }
          if (this.tag === 'add_to_cart') {
            newMessage.content = newMessage.content.replace(
              /\$/g,
              `${this.productOrdinalNumber}`
            );

            let productToAdd = Object.assign({}, this.selectedProduct);
            productToAdd = { ...productToAdd, sizes: [this.size] };
            this.store.dispatch(
              CartAction.addToCart({ product: productToAdd })
            );
          }
          if (this.tag === 'product_navigation') {
            this.router.navigate([`product/${this.selectedProduct?.id}`]);
          }
          this.addMessage(newMessage);
        } else {
          const [products, message]: [ProductInterface[], MessageInterface] =
            result;
          if (this.tag === 'brand_info') {
            message.content += `${products.length} product${
              products.length !== 1 ? 's' : ''
            } with from that brand`;
          } else {
            message.content += `${products.length} color${
              products.length !== 1 ? 's' : ''
            }`;
          }

          message.productsInfo = products;
          this.latestDisplayedProducts = products;
          this.addMessage(message);
        }
        this.scrollToBottom();
      });
  }

  private unsubscribe(): void {
    this.subscriptions.forEach((subscription: Subscription) =>
      subscription.unsubscribe()
    );
  }
}
