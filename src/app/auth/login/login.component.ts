import { ChangeDetectionStrategy, Component, OnInit, Renderer2 } from '@angular/core';
import { animationFrame, animationFrameScheduler, concat, interval, of, scheduled, Scheduler, timer } from 'rxjs';
import { map, repeat, takeUntil, takeWhile, tap, timeInterval, timestamp } from 'rxjs/operators'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  
  constructor() { }


  ngOnInit(): void {
  }

  


}
