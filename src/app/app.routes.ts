import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/calendar/calendar.component').then(m => m.CalendarComponent)
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
  },
  {
    title: 'Advent of Code - Day 5',
    path: 'day/5',
    loadComponent: () => import('./components/day5/day5.component').then(m => m.Day5Component)
  },
  {
    title: 'Advent of Code - Day 6',
    path: 'day/6',
    loadComponent: () => import('./components/day6/day6.component').then(m => m.Day6Component)
  },
  {
    title: 'Advent of Code - Day 7',
    path: 'day/7',
    loadComponent: () => import('./components/day7/day7.component').then(m => m.Day7Component)
  }
];
