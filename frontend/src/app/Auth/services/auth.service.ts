import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthDTO } from '../models/auth.dto';

interface AuthToken {
  user_id: string;
  access_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private urlBlogUocApi: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'auth';
    this.urlBlogUocApi = environment.apiUrl + '/' + this.controller;
  }

  login(auth: AuthDTO): Observable<AuthToken> {
    return this.http.post<AuthToken>(this.urlBlogUocApi, auth);
  }
}
