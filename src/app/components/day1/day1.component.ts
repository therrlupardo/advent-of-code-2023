import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { map, Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-day1',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule],
  templateUrl: './day1.component.html',
})
export class Day1Component {
  constructor(private httpClient: HttpClient) {
  }

  private taskOneTestDataSource$ = this.httpClient.get('./assets/day1/test1.txt', {responseType: 'text'});
  private taskTwoTestDataSource$ = this.httpClient.get('./assets/day1/test2.txt', {responseType: 'text'});
  private finalDataSource$ = this.httpClient.get('./assets/day1/final.txt', {responseType: 'text'});

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

  private firstTask(data: string): Observable<number> {
    return of(data).pipe(
      map(data => data?.split('\r\n')),
      map(lines => lines.filter(line => line !== '')),
      map(lines => lines.map(line => line.replaceAll(/[^0-9]/g, ''))),
      map(lines => lines.map(line => ({
          firstDigit: line[0],
          lastDigit: line[line.length - 1]
        })
      ).map(value => +`${value.firstDigit}${value.lastDigit}`)),
      map(lines => lines.reduce((value: number, sum: number) => sum += value, 0)),
    );
  }


  private secondTask(data: string): Observable<number> {
    return of(data).pipe(
      map(data => data?.split('\r\n')),
      map(lines => lines.filter(line => line !== '')),
      map(lines => lines.map(line => {
          const elements = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'zero'];
          const list = elements.map(element => ({
              element,
              firstIndex: line.indexOf(element),
              lastIndex: line.lastIndexOf(element)
            }))
              .filter(entry => entry.firstIndex >= 0)
          ;
          const firstDigit = this.replaceStringDigitWithNumber(list.sort((a, b) => a.firstIndex - b.firstIndex)[0].element);
          const lastDigit = this.replaceStringDigitWithNumber(list.sort((a, b) => b.lastIndex - a.lastIndex)[0].element);
          return +`${firstDigit}${lastDigit}`;
        }
      ).reduce((value: number, sum: number) => sum += value, 0)),
    );
  }

  private replaceStringDigitWithNumber(str: string): number {
    switch (str) {
      case 'one':
        return 1;
      case 'two':
        return 2;
      case 'three':
        return 3;
      case 'four':
        return 4;
      case 'five':
        return 5;
      case 'six':
        return 6;
      case 'seven':
        return 7;
      case 'eight':
        return 8;
      case 'nine':
        return 9;
      case 'zero':
        return 0;
      default:
        return +str;
    }
  }

}
