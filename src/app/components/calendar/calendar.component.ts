import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { routes } from '../../app.routes';

@Component({
  selector: 'app-calendar',
  standalone: true,
  templateUrl: './calendar.component.html',
  imports: [
    MatIconModule,
    RouterLink
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent {
  readonly days: { index: number, notCompleted: boolean }[] = Array.from({length: 25}, (_, index) => ({
    index: index + 1,
    notCompleted: index >= routes.length - 1
  }));

}
