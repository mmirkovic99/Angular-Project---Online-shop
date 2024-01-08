import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription, forkJoin, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { ChatbotFAQInterface } from 'src/app/models/chatbotFAQ.interface';
import { MessageInterface } from 'src/app/models/message.interface';
import { ProductInterface } from 'src/app/models/product.interface';
import { ChatbotService } from 'src/app/services/chatbot.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.scss'],
})
export class ChatBotComponent implements OnInit, AfterViewInit {
  @ViewChild('messageContainer') messageContainer!: ElementRef;
  messages: MessageInterface[] = [];
  subscription: Subscription[] = [];
  messageForm!: FormGroup;
  questions!: ChatbotFAQInterface[];

  constructor(
    private formBuilder: FormBuilder,
    private chatbotService: ChatbotService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
  }

  ngOnInit(): void {
    this.messageForm = this.buildForm();
  }

  getFormControl(name: string): FormControl {
    return this.messageForm.get(name) as FormControl;
  }

  sendMessage() {
    const message = this.getFormControl('message').value;
    if (message.trim() === '') return;
    this.addMessage({ sender: 'user', content: message });
    this.getFormControl('message').setValue('');

    this.chatbotService
      .getTagByInput(message)
      .pipe(
        switchMap((tag: string) => {
          if (tag === 'product_info') {
            return forkJoin([
              this.productService.getProductByTitle(message),
              this.chatbotService.getResponseByTag(tag),
            ]);
          } else {
            return this.chatbotService.getResponseByTag(tag);
          }
        })
      )
      .subscribe((result) => {
        if (!Array.isArray(result)) this.addMessage(result as MessageInterface);
        else {
          const [products, message]: [ProductInterface[], MessageInterface] =
            result;
          message.content += `${products.length} color${
            products.length !== 1 ? 's' : ''
          }`;

          message.productsInfo = products;
          this.addMessage(message);
        }
      });
  }

  navigateProduct(productId: number) {
    this.router.navigate([`product/${productId}`]);
  }

  private buildForm() {
    return this.formBuilder.group({
      message: [''],
    });
  }

  private addMessage(message: MessageInterface): void {
    this.messages.push(message);
  }
}
