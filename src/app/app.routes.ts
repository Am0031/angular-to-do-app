import { Routes } from '@angular/router';
import { Home } from './home/home';
import { TodoList } from './todo-list/todo-list';
import { Recipes } from './recipes/recipes';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'todos', component: TodoList },
  { path: 'recipes', component: Recipes },
];
