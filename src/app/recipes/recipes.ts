import { Component, inject, signal } from '@angular/core';
import { RecipesService } from './recipes.service';
import { RecipeModal } from './recipe-modal/recipe-modal';
import { Recipe, RecipeFormData } from './recipe.model';

@Component({
  selector: 'app-recipes',
  imports: [RecipeModal],
  templateUrl: './recipes.html',
  styleUrl: './recipes.css',
})
export class Recipes {
  private service = inject(RecipesService);

  recipes = this.service.recipes;

  modalOpen = signal(false);
  modalMode = signal<'view' | 'edit' | 'add'>('view');
  selectedRecipe = signal<Recipe | null>(null);

  openView(recipe: Recipe) {
    this.selectedRecipe.set(recipe);
    this.modalMode.set('view');
    this.modalOpen.set(true);
  }

  openEdit(recipe: Recipe) {
    this.selectedRecipe.set(recipe);
    this.modalMode.set('edit');
    this.modalOpen.set(true);
  }

  openAdd() {
    this.selectedRecipe.set(null);
    this.modalMode.set('add');
    this.modalOpen.set(true);
  }

  closeModal() {
    this.modalOpen.set(false);
  }

  onSave(data: RecipeFormData) {
    if (data.id !== undefined) {
      const { id, ...rest } = data;
      this.service.update(id, rest);
    } else {
      const { id, ...rest } = data;
      this.service.add(rest);
    }
    this.closeModal();
  }

  onDelete(id: number) {
    this.service.delete(id);
    this.closeModal();
  }
}
