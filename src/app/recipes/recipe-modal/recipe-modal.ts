import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Recipe, RecipeFormData } from '../recipe.model';

@Component({
  selector: 'app-recipe-modal',
  imports: [FormsModule],
  templateUrl: './recipe-modal.html',
  styleUrl: './recipe-modal.css',
})
export class RecipeModal implements OnInit {
  @Input() recipe: Recipe | null = null;
  @Input() startMode: 'view' | 'edit' | 'add' = 'view';

  @Output() closeModal = new EventEmitter<void>();
  @Output() saveRecipe = new EventEmitter<RecipeFormData>();
  @Output() deleteRecipe = new EventEmitter<number>();

  mode: 'view' | 'edit' | 'add' = 'view';
  showDeleteConfirm = false;
  imgFailed = false;
  formImgFailed = false;

  form = {
    name: '',
    description: '',
    category: '',
    prepTime: '',
    servings: 2,
    imageUrl: '',
    ingredientsText: '',
    instructions: '',
  };

  ngOnInit() {
    this.mode = this.startMode;
    if (this.recipe) {
      this.populateForm(this.recipe);
    }
  }

  private populateForm(r: Recipe) {
    this.form = {
      name: r.name,
      description: r.description,
      category: r.category,
      prepTime: r.prepTime,
      servings: r.servings,
      imageUrl: r.imageUrl,
      ingredientsText: r.ingredients.join('\n'),
      instructions: r.instructions,
    };
  }

  get isFormMode() {
    return this.mode === 'edit' || this.mode === 'add';
  }

  switchToEdit() {
    this.mode = 'edit';
    this.showDeleteConfirm = false;
  }

  onSave() {
    const { ingredientsText, ...rest } = this.form;
    const data: RecipeFormData = {
      ...(this.recipe ? { id: this.recipe.id } : {}),
      ...rest,
      ingredients: ingredientsText
        .split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0),
    };
    this.saveRecipe.emit(data);
  }

  onDelete() {
    if (this.recipe) {
      this.deleteRecipe.emit(this.recipe.id);
    }
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as Element).classList.contains('modal-backdrop')) {
      this.closeModal.emit();
    }
  }

  onFormImageChange() {
    this.formImgFailed = false;
  }
}
