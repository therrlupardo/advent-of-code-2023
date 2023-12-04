import { HttpClient } from '@angular/common/http';
import { inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable, switchMap } from 'rxjs';

export abstract class AbstractDayComponent {
  protected dayNumber = signal(0);
  protected firstTaskSolved = signal(false);
  protected secondTaskSolved = signal(false);

  private httpClient = inject(HttpClient);

  private taskOneTestDataSource$ = toObservable(this.dayNumber).pipe(
    switchMap(dayNumber => this.httpClient.get(`./assets/day${dayNumber}/test1.txt`, {responseType: 'text'})));
  private taskTwoTestDataSource$ = toObservable(this.dayNumber).pipe(
    switchMap(dayNumber => this.httpClient.get(`./assets/day${dayNumber}/test2.txt`, {responseType: 'text'})));
  private finalDataSource$ = toObservable(this.dayNumber).pipe(
    switchMap(dayNumber => this.httpClient.get(`./assets/day${dayNumber}/final.txt`, {responseType: 'text'})));

  protected firstTaskTestDataSolution$ = this.taskOneTestDataSource$.pipe(
    switchMap(data => this.firstTask(data))
  );
  protected firstTaskFinalDataSolution$ = this.finalDataSource$.pipe(
    switchMap(data => this.firstTask(data))
  );
  protected secondTaskTestDataSolution$ = this.taskTwoTestDataSource$.pipe(
    switchMap(data => this.secondTask(data))
  );
  protected secondTaskFinalDataSolution$ = this.finalDataSource$.pipe(
    switchMap(data => this.secondTask(data))
  );

  protected abstract firstTask(data: string): Observable<number>;

  protected abstract secondTask(data: string): Observable<number>;

}
