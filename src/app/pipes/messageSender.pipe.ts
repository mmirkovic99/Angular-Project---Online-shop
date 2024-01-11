import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'msgSender',
})
export class MessageSenderPipe implements PipeTransform {
  transform(sender: string): string {
    return sender === 'bot' ? 'Trendo bot' : 'You';
  }
}
