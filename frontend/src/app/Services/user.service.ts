import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserDTO } from '../Models/user.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);

  private urlBlogUocApi: string;
  private controller: string;

  constructor() {
    this.controller = 'users';
    this.urlBlogUocApi = environment.apiUrl + '/' + this.controller;
  }

  register(user: UserDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(this.urlBlogUocApi, user);
  }

  updateUser(userId: string, user: UserDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(this.urlBlogUocApi + '/' + userId, user);
  }

  getUSerById(userId: string): Observable<UserDTO> {
    return this.http.get<UserDTO>(this.urlBlogUocApi + '/' + userId);
  }
}
