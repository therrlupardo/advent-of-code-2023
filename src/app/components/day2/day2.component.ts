import { AsyncPipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { map, Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-day2',
  standalone: true,
  imports: [
    AsyncPipe,
    HttpClientModule
  ],
  templateUrl: './day2.component.html',
  styleUrl: './day2.component.scss'
})
export class Day2Component {
  constructor(private httpClient: HttpClient) {
  }

  private taskOneTestDataSource$ = this.httpClient.get('./assets/day2/test1.txt', {responseType: 'text'});
  private taskTwoTestDataSource$ = this.httpClient.get('./assets/day2/test2.txt', {responseType: 'text'});
  private finalDataSource$ = this.httpClient.get('./assets/day2/final.txt', {responseType: 'text'});

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
    return this.prepareData(data).pipe(
      map(lines => lines.map(line => {
          const enoughRed = line.results.red <= 12;
          const enoughBlue = line.results.blue <= 14;
          const enoughGreen = line.results.green <= 13;

          return {id: line.id, isPossible: enoughRed && enoughBlue && enoughGreen};
        })
        .filter(line => line.isPossible)
        .map(line => line.id)
      ),
      map(lines => lines.reduce((value: number, sum: number) => sum += value, 0))
    );
  }
  private secondTask(data: string): Observable<number> {
    return this.prepareData(data).pipe(
      map(lines => lines
        .map(line => line.results.green * line.results.red * line.results.blue)
        .reduce((value: number, sum: number) => sum += value, 0))
    );
  }

  private prepareData(data: string): Observable<{id: number, results: ColorObject}[]> {
    return of(data).pipe(
      map(data => data?.split('\r\n')),
      map(lines => lines.filter(line => line !== '')),
      map(lines => lines.map(line => line.split(': '))
        .map(line => ({id: line[0].split(' '), games: line[1]}))
        .map(line => {
          const results = line.games.split('; ')
            .map(game => game.split(', ')
              .map(value => value.split(' '))
              .map(value => ({[value[1]]: +value[0]} as unknown as ColorObject))
            )
            .flatMap(value => value)
            .reduce((obj: ColorValues, entry: ColorObject) => {
              obj.green.push(entry.green ?? 0);
              obj.red.push(entry.red ?? 0);
              obj.blue.push(entry.blue ?? 0);
              return obj;
            }, {green: [], red: [], blue: []});
          const red = results.red.reduce((max, value) => max = Math.max(value, max), 0);
          const green = results.green.reduce((max, value) => max = Math.max(value, max), 0);
          const blue = results.blue.reduce((max, value) => max = Math.max(value, max), 0);
          return {id: +line.id[1], results: {red, green, blue} as ColorObject};
        })
      )
    );
  }
}


interface ColorValues {
  blue: number[];
  red: number[];
  green: number[];
}

interface ColorObject {
  blue: number;
  red: number;
  green: number;
}
