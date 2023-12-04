import { AsyncPipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { AbstractDayComponent } from '../../templates/abstract-day.component';

@Component({
  selector: 'app-day4',
  standalone: true,
  imports: [AsyncPipe, HttpClientModule, MatIconModule, RouterLink],
  templateUrl: '../../templates/day.template.html',
})
export class Day4Component extends AbstractDayComponent {
  constructor() {
    super();
    this.dayNumber.set(4);
    this.firstTaskSolved.set(true);
    this.secondTaskSolved.set(true);
  }


  protected firstTask(data: string): Observable<number> {
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


  protected secondTask(data: string): Observable<number> {
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
