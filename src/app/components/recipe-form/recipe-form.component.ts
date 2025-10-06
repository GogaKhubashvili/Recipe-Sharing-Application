import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.scss'],
})
export class RecipeFormComponent implements OnInit {
  fb = inject(FormBuilder);
  service = inject(RecipeService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  isEdit = signal(false);

  form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    ingredients: this.fb.array([]),
    instructions: ['', [Validators.required, Validators.minLength(10)]],
    thumbnail: [''],
  });

  get ingredients() {
    return this.form.get('ingredients') as FormArray;
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      this.isEdit.set(true);
      const id = Number(idParam);
      this.service.fetchById(id).subscribe((recipe) => {
        this.loadRecipe(recipe);
      });
    }
  }

  loadRecipe(recipe: Recipe) {
    this.form.patchValue({
      title: recipe.title,
      description: recipe.description,
      instructions: recipe.instructions,
      thumbnail: recipe.thumbnail || '',
    });

    this.ingredients.clear();
    if (recipe.ingredients && recipe.ingredients.length > 0) {
      recipe.ingredients.forEach((ing) => {
        this.ingredients.push(this.fb.control(ing, [Validators.required]));
      });
    } else {
      this.ingredients.push(this.fb.control('', [Validators.required]));
    }
  }

  addIngredient() {
    this.ingredients.push(this.fb.control('', [Validators.required]));
  }

  removeIngredient(index: number) {
    if (index < 0 || index >= this.ingredients.length) return;
    this.ingredients.removeAt(index);
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const base64 = await file.arrayBuffer().then((buf) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(new Blob([buf], { type: file.type }));
      });
    });

    this.form.get('thumbnail')?.setValue(base64);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.value as Recipe;
    const idParam = this.route.snapshot.paramMap.get('id');

    if (this.isEdit()) {
      const id = Number(idParam);
      this.service.update(id, payload).subscribe(() => {
        this.router.navigate(['/recipes', id]);
      });
    } else {
      this.service.create({ ...payload, favorite: false }).subscribe((created) => {
        this.router.navigate(['/recipes', created.id]);
      });
    }
  }

  confirmCancel(event: Event) {
    event.preventDefault();

    if (this.form.dirty) {
      const leave = confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!leave) {
        return;
      }
    }

    if (this.isEdit()) {
      const id = this.route.snapshot.paramMap.get('id');
      this.router.navigate(['/recipes', id]);
    } else {
      this.router.navigate(['/']);
    }
  }
}
