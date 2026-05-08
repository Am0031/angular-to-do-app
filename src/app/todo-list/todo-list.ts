import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

export type TodoStatus = 'todo' | 'in-progress' | 'done';

export interface TodoItem {
  id: number;
  text: string;
  status: TodoStatus;
}

const STORAGE_KEY = 'todo-items';

@Component({
  selector: 'app-todo-list',
  imports: [FormsModule],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css',
})
export class TodoList {
  items = signal<TodoItem[]>(this.load());
  newText = signal('');
  private nextId = signal(this.computeNextId());

  remaining = computed(() => this.items().filter(i => i.status !== 'done').length);

  private load(): TodoItem[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch {
      return [];
    }
  }

  private save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items()));
  }

  private computeNextId(): number {
    const items = this.load();
    return items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
  }

  addItem() {
    const text = this.newText().trim();
    if (!text) return;
    this.items.update(list => [
      ...list,
      { id: this.nextId(), text, status: 'todo' },
    ]);
    this.nextId.update(n => n + 1);
    this.newText.set('');
    this.save();
  }

  setStatus(id: number, status: TodoStatus) {
    this.items.update(list =>
      list.map(item => (item.id === id ? { ...item, status } : item))
    );
    this.save();
  }

  removeItem(id: number) {
    this.items.update(list => list.filter(item => item.id !== id));
    this.save();
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') this.addItem();
  }

  trackById(_: number, item: TodoItem) {
    return item.id;
  }
}
