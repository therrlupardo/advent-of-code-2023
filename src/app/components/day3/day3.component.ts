import { AsyncPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { AbstractDayComponent } from '../../templates/abstract-day.component';

@Component({
  selector: 'app-day3',
  standalone: true,
  imports: [AsyncPipe, HttpClientModule, MatIconModule, RouterLink],
  templateUrl: '../../templates/day.template.html',
})
export class Day3Component extends AbstractDayComponent {
  constructor() {
    super();
    this.dayNumber.set(3);
    this.firstTaskSolved.set(true);
    this.secondTaskSolved.set(true);
  }

  protected firstTask(data: string): Observable<number> {
    const LINE_LENGTH = data.split('\r\n')[0].length;
    const DATA_MAP = data.split('\r\n').map(line => line.split(''));
    return of(data).pipe(
      map(data => data.split('\r\n')
        .map((line, index) => {
          const numbers = Array.from(line.matchAll(/\d+/g), entry => ({index: entry.index, item: entry[0]}));
          return numbers.map(item => {
            const itemIndex = item.index ?? 0;
            const itemEndIndex = itemIndex + item.item.length - 1;
            const chunk = Array.from({length: itemEndIndex - itemIndex + 3}, (_, i) => itemIndex - 1 + i)
              .flatMap(x => Array.from({length: 3}, (_, i) => index - 1 + i).map(y => ({x, y})))
              .map(coords => {
                if (coords.y < 0 || coords.y > LINE_LENGTH || coords.x < 0 || coords.x > LINE_LENGTH) {
                  return null
                }
                if (coords.y === index && coords.x >= itemIndex && coords.x < itemEndIndex) {
                  return null;
                }
                const sign = DATA_MAP[coords.y][coords.x];
                if (sign === '\r' || sign === '\n' || sign === undefined) {
                  return null;
                }
                return sign;
              })
              .filter(item => item !== null && item !== '.' && isNaN(+item)
              );
            return {
              value: +item?.item,
              isPartNumber: chunk?.length > 0
            }
          });
        })
      ),
      map(data => data
        .map(line => line.reduce((sum, item) => sum + (item.isPartNumber ? item.value : 0), 0))
        .reduce((sum, item) => sum + item, 0)
      ),
    );
  }


  protected secondTask(data: string): Observable<number> {
    const LINE_LENGTH = data.split('\r\n')[0].length;
    const DATA_MAP = data.split('\r\n').map(line => line.split(''));
    return of(data).pipe(
      map(data => data.split('\r\n')
        .map((line, index) => {
          const numbers = Array.from(line.matchAll(/\d+/g), entry => ({index: entry.index, item: entry[0]}));
          return numbers.map(item => {
            const itemIndex = item.index ?? 0;
            const itemEndIndex = itemIndex + item.item.length - 1;
            const chunk = Array.from({length: itemEndIndex - itemIndex + 3}, (_, i) => itemIndex - 1 + i)
              .flatMap(x => Array.from({length: 3}, (_, i) => index - 1 + i).map(y => ({x, y})))
              .map(coords => {
                if (coords.y < 0 || coords.y > LINE_LENGTH || coords.x < 0 || coords.x > LINE_LENGTH) {
                  return null
                }
                if (coords.y === index && coords.x >= itemIndex && coords.x < itemEndIndex) {
                  return null;
                }
                const sign = DATA_MAP[coords.y][coords.x];
                if (sign === '\r' || sign === '\n' || sign === undefined) {
                  return null;
                }
                return {sign, coords};
              })
              .filter(item => item !== null && item.sign !== '.' && isNaN(+item.sign)
              );
            return {
              value: +item?.item,
              stars: chunk.filter(entry => entry?.sign === '*')
            }
          })
            .map(item => item.stars
              .map(star => ({...star, numberValue: item.value}))
            )
            .filter(item => item?.length > 0);
        })
        .filter(array => array.length > 0)
        .flatMap(array => array.flatMap(a => a))
      ),
      map((data: Item[]) => data.reduce((acc: GroupedItem, item: Item) => {
          const key = `${item?.coords?.x},${item?.coords?.y}`
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(item?.numberValue);
          return acc;
        }, {} as GroupedItem)
      ),
      map(data => Object.values(data)
        .filter(entry => entry.length === 2)
        .map(entry => entry.reduce((sum, value) => sum * value, 1))
        .reduce((sum, value) => sum + value, 0)
      )
    )
  }

}

interface Item {
  coords?: { x: number; y: number };
  numberValue: number;
  sign?: string;
}

interface GroupedItem {
  [key: string]: number[];
}
