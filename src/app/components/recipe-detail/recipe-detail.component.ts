import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss'],
})
export class RecipeDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(RecipeService);
  private router = inject(Router);

  recipe = signal<Recipe | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.service.fetchById(id).subscribe({
      next: (data) => {
        this.recipe.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.router.navigateByUrl('/404');
      },
    });
  }

  delete(id: number) {
    if (!confirm('Delete this recipe?')) return;
    this.service.remove(id).subscribe(() => {
      this.router.navigateByUrl('/');
    });
  }

  toggleFavorite(item: Recipe) {
    const next = !item.favorite;
    this.service
      .update(item.id!, { favorite: next })
      .subscribe((updated) => this.recipe.set(updated));
  }
}
