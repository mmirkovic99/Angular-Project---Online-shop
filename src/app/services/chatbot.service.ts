import { Injectable } from '@angular/core';
import { API_BASE_URL, API_ENDPOINTS } from '../constants/app.constants';
import { HttpClient } from '@angular/common/http';
import { ChatbotInterface } from '../models/chatbot.interface';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MessageInterface } from '../models/message.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  private url = `${API_BASE_URL}${API_ENDPOINTS.CHATBOT}`;

  constructor(private http: HttpClient) {}

  getAllChatbotFAQ(): Observable<ChatbotInterface[]> {
    return this.http.get<ChatbotInterface[]>(this.url);
  }

  getTagByInput(userMessage: string): Observable<string> {
    return this.http
      .get<ChatbotInterface[]>(`${this.url}?phrases_like=${userMessage}`)
      .pipe(
        map((question: ChatbotInterface[]) =>
          question.length > 0 ? question[0].tag : 'default'
        )
      );
  }

  getResponseByTag(
    tag: string,
    isSizeAvailable?: boolean
  ): Observable<MessageInterface> {
    return tag !== 'default'
      ? this.http.get<ChatbotInterface[]>(this.url, { params: { tag } }).pipe(
          map((question: ChatbotInterface[]) => {
            let index: number = -1;
            if (tag === 'product_size_selection') {
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
