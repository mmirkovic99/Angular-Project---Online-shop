import { Injectable } from '@angular/core';
import { API_BASE_URL, API_ENDPOINTS } from '../constants/app.constants';
import { HttpClient } from '@angular/common/http';
import { ChatbotInterface } from '../models/chatbot.interface';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MessageInterface } from '../models/message.interface';
import { Tags } from '../constants/chatbot.constants';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  private url = `${API_BASE_URL}${API_ENDPOINTS.CHATBOT}`;

  constructor(private http: HttpClient) {}

  private getAllChatbotFAQ(): Observable<ChatbotInterface[]> {
    return this.http.get<ChatbotInterface[]>(this.url);
  }

  getTagByInput(userMessage: string): Observable<string> {
    return this.getAllChatbotFAQ().pipe(
      map((questions: ChatbotInterface[]) => {
        const question: ChatbotInterface | undefined = questions.find(
          (question: ChatbotInterface) =>
            question.phrases.find((phrase: string) => phrase === userMessage)
        );
        return typeof question !== 'undefined' ? question.tag : Tags.DEFAULT;
      })
    );
  }

  getResponseByTag(
    tag: string,
    isSizeAvailable?: boolean
  ): Observable<MessageInterface> {
    return tag !== Tags.DEFAULT
      ? this.http.get<ChatbotInterface[]>(this.url, { params: { tag } }).pipe(
          map((question: ChatbotInterface[]) => {
            let index: number = -1;
            if (tag === Tags.PRODUCT_SIZE_SELECTION) {
              index = isSizeAvailable ? 0 : 1;
            } else {
              index = Math.floor(Math.random() * question[0].responses.length);
            }
            return { sender: 'bot', content: question[0].responses[index] };
          })
        )
      : of({
          sender: 'bot',
          content: "I don't understand what are you telling me.",
        });
  }
}
