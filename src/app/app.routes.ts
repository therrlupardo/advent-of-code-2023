import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'day/4',
    pathMatch: 'full'
  },
  {
    title: 'Advent of Code - Day 1',
    path: 'day/1',
    loadComponent: () => import('./components/day1/day1.component').then(m => m.Day1Component)
  },
  {
    title: 'Advent of Code - Day 2',
    path: 'day/2',
    loadComponent: () => import('./components/day2/day2.component').then(m => m.Day2Component)
  },
  {
    title: 'Advent of Code - Day 3',
    path: 'day/3',
    loadComponent: () => import('./components/day3/day3.component').then(m => m.Day3Component)
  },
  {
    title: 'Advent of Code - Day 4',
    path: 'day/4',
    loadComponent: () => import('./components/day4/day4.component').then(m => m.Day4Component)
  }
];
