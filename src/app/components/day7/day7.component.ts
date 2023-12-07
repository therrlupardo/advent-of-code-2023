import {Component, inject, Injectable} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {MatIconModule} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {AbstractDayComponent} from "../../templates/abstract-day.component";
import {map, Observable, of, tap} from "rxjs";


@Injectable()
class Task1Solver implements Day7Solver {
  public findHandType(cards: string): HandTypeEnum {
    const split = cards.split('');
    const grouped = split.reduce((groups: GroupedCardsType, card: string) => {
      if (!groups[card]) {
        groups[card] = 1;
      } else {
        groups[card]++;
      }
      return groups;
    }, {});
    if (Object.values(grouped).some(value => value === 5)) {
      return HandTypeEnum.FIVE_OF_KIND;
    } else if (Object.values(grouped).some(value => value === 4)) {
      return HandTypeEnum.FOUR_OF_KIND;
    } else if (Object.values(grouped).some(value => value === 3) && Object.values(grouped).some(value => value === 2)) {
      return HandTypeEnum.FULL_HOUSE;
    } else if (Object.values(grouped).some(value => value === 3)) {
      return HandTypeEnum.THREE_OF_KIND;
    } else if (Object.values(grouped).filter(value => value === 2)?.length === 2) {
      return HandTypeEnum.TWO_PAIR;
    } else if (Object.values(grouped).some(value => value === 2)) {
      return HandTypeEnum.ONE_PAIR;
    } else {
      return HandTypeEnum.HIGH_CARD;
    }
  }

  public compareCards(cards1: string, cards2: string): number {
    const split1 = cards1.split('');
    const split2 = cards2.split('');
    for (let i = 0; i < split1.length; i++) {
      const card1Value = this.getCardValue(split1[i]);
      const card2Value = this.getCardValue(split2[i]);
      if (card1Value > card2Value) {
        return -1;
      } else if (card1Value < card2Value) {
        return 1;
      }
    }
    return 0;
  }

  public getCardValue(card: string): number {
    switch (card) {
      case 'T':
        return 10;
      case 'J':
        return 11;
      case 'Q':
        return 12;
      case 'K':
        return 13;
      case 'A':
        return 14;
      default:
        return +card;
    }
  }
}

@Injectable()
class Task2Solver implements Day7Solver {

  findHandType(cards: string): HandTypeEnum {
    const split = cards.split('');
    const grouped = split.reduce((groups: GroupedCardsType, card: string) => {
      if (!groups[card]) {
        groups[card] = 1;
      } else {
        groups[card]++;
      }
      return groups;
    }, {});
    if (Object.values(grouped).some(value => value === 5)) {
      return HandTypeEnum.FIVE_OF_KIND;
    } else if (Object.values(grouped).some(value => value === 4)) {
      if (grouped['J'] === 1 || grouped['J'] === 4) {
        return HandTypeEnum.FIVE_OF_KIND;
      }
      return HandTypeEnum.FOUR_OF_KIND;
    } else if (Object.values(grouped).some(value => value === 3) && Object.values(grouped).some(value => value === 2)) {
      if (grouped['J'] === 2 || grouped['J'] === 3) {
        return HandTypeEnum.FIVE_OF_KIND;
      }
      return HandTypeEnum.FULL_HOUSE;
    } else if (Object.values(grouped).some(value => value === 3)) {
      if (grouped['J'] === 3) {
        return HandTypeEnum.FOUR_OF_KIND;
      }
      if (grouped['J'] === 2) {
        return HandTypeEnum.FIVE_OF_KIND;
      }
      if (grouped['J'] === 1) {
        return HandTypeEnum.FOUR_OF_KIND;
      }
      return HandTypeEnum.THREE_OF_KIND;
    } else if (Object.values(grouped).filter(value => value === 2)?.length === 2) {
      if (grouped['J'] === 2) {
        return HandTypeEnum.FOUR_OF_KIND;
      }
      if (grouped['J'] === 1) {
        return HandTypeEnum.FULL_HOUSE;
      }
      return HandTypeEnum.TWO_PAIR;
    } else if (Object.values(grouped).some(value => value === 2)) {
      if (grouped['J'] === 1 || grouped['J'] === 2) {
        return HandTypeEnum.THREE_OF_KIND;
      }
      return HandTypeEnum.ONE_PAIR;
    } else {
      if (grouped['J'] === 1) {
        return HandTypeEnum.ONE_PAIR;
      }
      return HandTypeEnum.HIGH_CARD;
    }
  }

  compareCards(cards1: string, cards2: string): number {
    const split1 = cards1.split('');
    const split2 = cards2.split('');
    for (let i = 0; i < split1.length; i++) {
      const card1Value = this.getCardValue(split1[i]);
      const card2Value = this.getCardValue(split2[i]);
      if (card1Value > card2Value) {
        return -1;
      } else if (card1Value < card2Value) {
        return 1;
      }
    }
    return 0;
  }

  getCardValue(card: string): number {
    switch (card) {
      case 'T':
        return 10;
      case 'J':
        return 0;
      case 'Q':
        return 12;
      case 'K':
        return 13;
      case 'A':
        return 14;
      default:
        return +card;
    }
  }

}

@Component({
  selector: 'app-day7',
  standalone: true,
  imports: [
    AsyncPipe,
    HttpClientModule,
    MatIconModule,
    RouterLink
  ],
  providers: [
    Task1Solver,
    Task2Solver
  ],
  templateUrl: '../../templates/day.template.html'
})
export class Day7Component extends AbstractDayComponent {
  constructor() {
    super();
    this.dayNumber.set(7);
    this.firstTaskSolved.set(true);
    this.secondTaskSolved.set(true);
  }

  private task1Solver = inject(Task1Solver);
  private task2Solver = inject(Task2Solver);

  protected firstTask(data: string): Observable<number> {
    return this.solveTask(data, this.task1Solver);
  }

  protected secondTask(data: string): Observable<number> {
    return this.solveTask(data, this.task2Solver);
  }

  private solveTask(data: string, solver: Day7Solver): Observable<number> {
    return of(data).pipe(
      map(data => {
          const sorted = data.split('\n')
            .filter(line => line !== '')
            .map(line => ({
              cards: line.split(' ')[0],
              bid: +line.split(' ')[1],
            }))
            .map(hand => ({
              ...hand,
              type: solver.findHandType(hand.cards)
            }))
            .sort((hand1, hand2) => {
              if (hand1.type > hand2.type) {
                return -1;
              } else if (hand1.type < hand2.type) {
                return 1;
              } else {
                return solver.compareCards(hand1.cards, hand2.cards);
              }
            })
            .reverse();
          return sorted
            .map((hand, index) => hand.bid * (index + 1))
            .reduce((total, reward) => total + reward, 0);
        }
      )
    );
  }

}

enum HandTypeEnum {
  HIGH_CARD,
  ONE_PAIR,
  TWO_PAIR,
  THREE_OF_KIND,
  FULL_HOUSE,
  FOUR_OF_KIND,
  FIVE_OF_KIND
}

type GroupedCardsType = { [key: string]: number };

interface Day7Solver {
  findHandType(cards: string): HandTypeEnum;

  compareCards(cards1: string, cards2: string): number;

  getCardValue(card: string): number;
}
