import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from '../models/recipe.model';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  http = inject(HttpClient);
  baseUrl = '/api/recipes';

  fetchAll(query?: { q?: string; favorite?: boolean }): Observable<Recipe[]> {
    const params: any = {};
    if (query) {
      if (query.q) {
        params['q'] = query.q;
      }
      if (query.favorite !== undefined) {
        params['favorite'] = String(query.favorite);
      }
    }
    return this.http.get<Recipe[]>(this.baseUrl, { params });
  }

  fetchById(id: number): Observable<Recipe> {
    return this.http.get<Recipe>(this.baseUrl + '/' + id);
  }

  create(payload: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(this.baseUrl, payload);
  }

  update(id: number, payload: Partial<Recipe>): Observable<Recipe> {
    return this.http.patch<Recipe>(this.baseUrl + '/' + id, payload);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(this.baseUrl + '/' + id);
  }
}
