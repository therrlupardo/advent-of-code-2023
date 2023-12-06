import { Component } from '@angular/core';
import { AbstractDayComponent } from '../../templates/abstract-day.component';
import { map, Observable, of, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-day5',
  standalone: true,
  imports: [
    AsyncPipe,
    HttpClientModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: '../../templates/day.template.html'
})
export class Day5Component extends AbstractDayComponent {

  constructor() {
    super();
    this.dayNumber.set(5);
    this.firstTaskSolved.set(true);
  }

  protected firstTask(data: string): Observable<number> {
    return of(data).pipe(
      map(data => {
        const lines = data?.split('\n\n');
        const seeds = lines[0].split(': ')[1].split(' ').map(v => +v);
        const maps = lines.map((line, index) => {
          if (index === 0) {
            return null as unknown as MapType;
          }
          const elements = line.split(':');
          const mapData = elements[0].split(' ')[0].split('-to-');
          return {
            sourceType: mapData[0],
            destinationType: mapData[1],
            value: elements[1].split('\n')
              .filter(value => !!value)
              .map(entry => {
                const entryElements = entry.split(' ').filter(value => !!value);
                return {
                  destinationIndex: +entryElements[0],
                  sourceIndex: +entryElements[1],
                  numberOfIndices: +entryElements[2]
                };
              })
          } as MapType;
        })
          .filter(Boolean);
        return {seeds, maps};
      }),
      map(({seeds, maps}) => seeds.map(seed => this.getLocationForSeed(maps, seed))),
      map(locations => Math.min(...locations))
    );
  }

  private mapSourceToDestination(maps: MapType[], previousIndex: number, destinationType: string): number {
    const valueMap = maps.find(mp => mp?.destinationType === destinationType)
      ?.value.find(value => {
        return value.sourceIndex <= previousIndex && value.sourceIndex + value.numberOfIndices >= previousIndex;
      });
    return !!valueMap ? valueMap?.destinationIndex + (previousIndex - valueMap?.sourceIndex) : previousIndex;
  }

  protected secondTask(data: string): Observable<number> {
    return of(data).pipe(
      map(data => {
        const lines = data?.split('\n\n');
        const seedsData = lines[0].split(': ')[1].split(' ').map(v => +v);
        // FIXME: 06-12-2023 mateusz.buchajewicz ta lista tutaj jest zdecydowanie za długa, trzeba to jakoś "w locie" redukować
        //  i od razu przeliczać, tak żeby mieć zawsze tylko jedną wartość - minimalną wartość location
        const seeds = seedsData.map((seed, index) => {
          if (index % 2 === 1) {
            return null;
          }
          return {startingSeed: seed, numberOfIndices: seedsData[index + 1]};
          // return Array.from({length: seedsData[index + 1]}, (_, i) => seed + i);
        }).filter(Boolean);
        const maps = lines.map((line, index) => {
          if (index === 0) {
            return null as unknown as MapType;
          }
          const elements = line.split(':');
          const mapData = elements[0].split(' ')[0].split('-to-');
          return {
            sourceType: mapData[0],
            destinationType: mapData[1],
            value: elements[1].split('\n')
              .filter(value => !!value)
              .map(entry => {
                const entryElements = entry.split(' ').filter(value => !!value);
                return {
                  destinationIndex: +entryElements[0],
                  sourceIndex: +entryElements[1],
                  numberOfIndices: +entryElements[2]
                };
              })
          } as MapType;
        })
          .filter(Boolean);
        return {seeds, maps};
      }),
      map(({seeds, maps}) => {
        return seeds.reduce((minLocation, seedData) => {
          console.log('Calculating minLocation for', seedData);
          if (!seedData) {
            return Number.MAX_VALUE;
          }
          let currentLocation = Number.MAX_VALUE;
          for (let i = 0; i < seedData.numberOfIndices; i++) {
            const locationForSeed = this.getLocationForSeed(maps, seedData.startingSeed + i);
            currentLocation = Math.min(currentLocation, locationForSeed);
            console.log(`Location for seed ${seedData.startingSeed + i}`, locationForSeed);
          }
          console.log('Calculated minLocation for', seedData, currentLocation);
          console.log('New minLocation', Math.min(minLocation, currentLocation));
          return Math.min(minLocation, currentLocation);
        }, Number.MAX_VALUE);
        // return seeds.map(seed => this.getLocationForSeed(maps, seed));
      }),
    );
  }

  private getLocationForSeed(maps: MapType[], seed: number): number {
    const soil = this.mapSourceToDestination(maps, seed, 'soil');
    const fertilizer = this.mapSourceToDestination(maps, soil, 'fertilizer');
    const water = this.mapSourceToDestination(maps, fertilizer, 'water');
    const light = this.mapSourceToDestination(maps, water, 'light');
    const temperature = this.mapSourceToDestination(maps, light, 'temperature');
    const humidity = this.mapSourceToDestination(maps, temperature, 'humidity');
    const location = this.mapSourceToDestination(maps, humidity, 'location');
    return location;
  }
}

interface MapType {
  sourceType: string;
  destinationType: string;
  value: {
    destinationIndex: number;
    sourceIndex: number;
    numberOfIndices: number;
  }[];
}
