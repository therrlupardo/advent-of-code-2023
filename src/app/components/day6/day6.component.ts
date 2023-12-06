import {Component} from '@angular/core';
import {AbstractDayComponent} from "../../templates/abstract-day.component";
import {map, Observable, of, reduce, tap} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {MatIconModule} from "@angular/material/icon";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-day6',
  standalone: true,
  imports: [
    AsyncPipe,
    HttpClientModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: '../../templates/day.template.html'
})
export class Day6Component extends AbstractDayComponent {
  constructor() {
    super();
    this.dayNumber.set(6);
    this.firstTaskSolved.set(true);
    this.secondTaskSolved.set(true);
  }

  protected firstTask(data: string): Observable<number> {
    return of(data).pipe(
      map(data => {
          const times = data.split('\n')[0]?.split(':')[1].split(' ').filter(x => x !== '').map(x => +x);
          const distances = data.split('\n')[1]?.split(':')[1].split(' ').filter(x => x !== '').map(x => +x);
          return Array.from({length: times?.length}, (_, i) => ({time: times[i], distance: distances[i]}));
        }
      ),
      map(races => races.map(race => {
        return Array.from({length: race.time + 1}, (_, i) => i)
          .map(timeHoldingButton => {
            const velocity = timeHoldingButton;
            const travelTime = race.time - timeHoldingButton;
            const distanceTraveled = velocity * travelTime;
            return distanceTraveled > race.distance;
          })
          .filter(Boolean)
          .length;
      })),
      map(races => races.reduce((total, curr) => total *= curr, 1))
    );
  }

  protected secondTask(data: string): Observable<number> {
    return of(data).pipe(
      map(data => {
          const time = +data.split('\n')[0]?.split(':')[1].replaceAll(' ', '')
          const distance = +data.split('\n')[1]?.split(':')[1].replaceAll(' ', '');
          return {time, distance};
        }
      ),
      map(race => Array.from({length: race.time + 1}, (_, i) => i)
        .map(timeHoldingButton => {
          const velocity = timeHoldingButton;
          const travelTime = race.time - timeHoldingButton;
          const distanceTraveled = velocity * travelTime;
          return distanceTraveled > race.distance;
        })
        .filter(Boolean)
        .length));
  }

}
