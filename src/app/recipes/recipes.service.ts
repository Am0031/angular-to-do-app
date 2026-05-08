import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe, RecipeFormData } from './recipe.model';

const STORAGE_KEY = 'recipes-data';

@Injectable({ providedIn: 'root' })
export class RecipesService {
  private http = inject(HttpClient);

  recipes = signal<Recipe[]>([]);

  constructor() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        this.recipes.set(JSON.parse(stored));
      } catch {
        this.seedFromFile();
      }
    } else {
      this.seedFromFile();
    }
  }

  private seedFromFile() {
    this.http.get<Recipe[]>('/data/recipes.json').subscribe({
      next: data => {
        this.recipes.set(data);
        this.persist();
      },
      error: () => this.recipes.set([]),
    });
  }

  private persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.recipes()));
  }

  private nextId(): number {
    const items = this.recipes();
    return items.length ? Math.max(...items.map(r => r.id)) + 1 : 1;
  }

  add(data: Omit<Recipe, 'id'>) {
    this.recipes.update(list => [...list, { ...data, id: this.nextId() }]);
    this.persist();
  }

  update(id: number, data: Omit<Recipe, 'id'>) {
    this.recipes.update(list =>
      list.map(r => (r.id === id ? { ...data, id } : r))
    );
    this.persist();
  }

  delete(id: number) {
    this.recipes.update(list => list.filter(r => r.id !== id));
    this.persist();
  }
}
