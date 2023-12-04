import { AsyncPipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { map, Observable, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-day4',
  standalone: true,
  imports: [
    AsyncPipe,
    HttpClientModule
  ],
  templateUrl: './day4.component.html',
  styleUrl: './day4.component.scss'
})
export class Day4Component {
  constructor(private httpClient: HttpClient) {
  }

  private taskOneTestDataSource$ = this.httpClient.get('./assets/day4/test1.txt', {responseType: 'text'});
  private taskTwoTestDataSource$ = this.httpClient.get('./assets/day4/test2.txt', {responseType: 'text'});
  private finalDataSource$ = this.httpClient.get('./assets/day4/final.txt', {responseType: 'text'});

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

  public firstTask(data: string): Observable<number> {
    return of(data).pipe(
      map(data => {
        return data.split('\r\n')
          .filter(line => !!line)
          .map(line => line.split(': ')[1])
          .map(line => {
            const splited = line.split(' | ');
            return {
              winningNumbers: splited[0].split(' ').filter(value => value !== '').map(num => +num),
              yourNumbers: splited[1].split(' ').filter(value => value !== '').map(num => +num)
            };
          })
          .map(({winningNumbers, yourNumbers}) => winningNumbers.filter(num => yourNumbers.includes(num)))
          .map(commonNumbers => commonNumbers.length === 0 ? 0 : Math.pow(2, commonNumbers.length - 1))
          .reduce((acc, curr) => acc + curr, 0);
      }),
    );
  }


  public secondTask(data: string): Observable<number> {
    return of(data).pipe(
      map(data => {
        const numberOfCards = data.split('\r\n').filter(line => !!line).length;
        const result = Array.from({length: numberOfCards}, () => 1);
        data.split('\r\n')
          .filter(line => !!line)
          .map(line => line.split(': ')[1])
          .map((line, index) => {
            const splited = line.split(' | ');
            return {
              index,
              winningNumbers: splited[0].split(' ').filter(value => value !== '').map(num => +num),
              yourNumbers: splited[1].split(' ').filter(value => value !== '').map(num => +num)
            };
          })
          .map(({winningNumbers, yourNumbers, index}) => ({
            index,
            numberOfWinningNumbers: winningNumbers.filter(num => yourNumbers.includes(num)).length
          }))
          .forEach(({index, numberOfWinningNumbers}) => {
            for (let i = index; i < index + numberOfWinningNumbers; i++) {
              result[i + 1] += result[index];
            }
          });
        return result.reduce((acc, curr) => acc + curr, 0);
      }),
      // tap(data => data.forEach((value, index) => console.log(`${index + 1}: ${value}`))),
    );
  }

}
