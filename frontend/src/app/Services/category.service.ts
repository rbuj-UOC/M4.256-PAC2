import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CategoryDTO } from '../Models/category.dto';

interface deleteResponse {
  affected: number;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);

  private urlBlogUocApi: string;
  private controller: string;

  constructor() {
    this.controller = 'categories';
    this.urlBlogUocApi = environment.apiUrl + '/' + this.controller;
  }

  getCategoriesByUserId(userId: string): Observable<CategoryDTO[]> {
    return this.http.get<CategoryDTO[]>(
      environment.apiUrl + '/users/categories/' + userId
    );
  }

  createCategory(category: CategoryDTO): Observable<CategoryDTO> {
    return this.http.post<CategoryDTO>(this.urlBlogUocApi, category);
  }

  getCategoryById(categoryId: string): Observable<CategoryDTO> {
    return this.http.get<CategoryDTO>(this.urlBlogUocApi + '/' + categoryId);
  }

  updateCategory(
    categoryId: string,
    category: CategoryDTO
  ): Observable<CategoryDTO> {
    return this.http.put<CategoryDTO>(
      this.urlBlogUocApi + '/' + categoryId,
      category
    );
  }

  deleteCategory(categoryId: string): Observable<deleteResponse> {
    return this.http.delete<deleteResponse>(
      this.urlBlogUocApi + '/' + categoryId
    );
  }
}
