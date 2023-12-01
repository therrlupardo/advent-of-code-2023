import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'day/1',
    pathMatch: 'full'
  },
  {
    title: 'Advent of Code - Day 1',
    path: 'day/1',
    loadComponent: () => import('./components/day1/day1.component').then(m => m.Day1Component)
  }
];
