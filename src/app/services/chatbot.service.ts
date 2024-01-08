import { Injectable } from '@angular/core';
import { API_BASE_URL, API_ENDPOINTS } from '../constants/app.constants';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ChatbotFAQInterface } from '../models/chatbotFAQ.interface';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { MessageInterface } from '../models/message.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  private url = `${API_BASE_URL}${API_ENDPOINTS.CHATBOT}`;

  constructor(private http: HttpClient) {}

  getAllChatbotFAQ(): Observable<ChatbotFAQInterface[]> {
    return this.http.get<ChatbotFAQInterface[]>(this.url);
  }

  getTagByInput(userMessage: string): Observable<string> {
    return this.http
      .get<ChatbotFAQInterface[]>(`${this.url}?phrases_like=${userMessage}`)
      .pipe(
        map((question: ChatbotFAQInterface[]) =>
          question.length > 0 ? question[0].tag : 'default'
        )
      );
  }

  getResponseByTag(tag: string): Observable<MessageInterface> {
    return tag !== 'default'
      ? this.http
          .get<ChatbotFAQInterface[]>(this.url, { params: { tag } })
          .pipe(
            map((question: ChatbotFAQInterface[]) => {
              const index = Math.floor(
                Math.random() * question[0].responses.length
              );
              return { sender: 'bot', content: question[0].responses[index] };
            })
          )
      : of({
          sender: 'bot',
          content: "I don't understand what are you telling me.",
        });
  }
}
