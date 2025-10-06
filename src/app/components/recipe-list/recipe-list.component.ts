import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.scss',
})
export class RecipeListComponent implements OnInit {
  recipeService = inject(RecipeService);

  searchQuery = '';
  shortSearch = signal(false);
  onlyFavorites = signal(false);
  loading = signal(false);
  recipes = signal<Recipe[]>([]);
  error = signal(false);

  ngOnInit(): void {
    const saved = localStorage.getItem('onlyFavorites');
    if (saved === 'true') {
      this.onlyFavorites.set(true);
    }

    this.loadRecipes();
  }

  onSearch() {
    const query = this.searchQuery.trim().toLowerCase();

    if (query.length === 0) {
      this.shortSearch.set(false);
      this.loadRecipes();
      return;
    }

    if (query.length < 1) {
      this.shortSearch.set(true);
      this.recipes.set([]);
      return;
    }

    this.shortSearch.set(false);
    this.loadRecipes();
  }

  toggleFavorites() {
    const newValue = !this.onlyFavorites();
    this.onlyFavorites.set(newValue);

    localStorage.setItem('onlyFavorites', String(newValue));

    this.loadRecipes();
  }

  loadRecipes() {
    this.loading.set(true);
    this.error.set(false);

    this.recipeService
      .fetchAll({
        q: this.searchQuery,
        favorite: this.onlyFavorites() ? true : undefined,
      })
      .subscribe({
        next: (data) => {
          this.recipes.set(data);
          this.error.set(false);
        },
        error: (err) => {
          console.error(err);
          this.recipes.set([]);
          this.error.set(true);
        },
        complete: () => {
          this.loading.set(false);
        },
      });
  }

  toggleFavorite(item: Recipe) {
    const next = !item.favorite;
    this.recipeService.update(item.id!, { favorite: next }).subscribe({
      next: (updated) => {
        this.recipes.set(this.recipes().map((r) => (r.id === updated.id ? updated : r)));
      },
      error: (err) => {
        console.error('Failed to update favorite', err);
      },
    });
  }
}
