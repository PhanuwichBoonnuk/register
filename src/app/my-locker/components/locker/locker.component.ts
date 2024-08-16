import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import * as dayjs from 'dayjs';
import * as relativeTime from 'dayjs/plugin/relativeTime';
import { AppConfig } from '@config';


dayjs.extend(relativeTime);

@Component({
  selector: 'app-locker',
  templateUrl: './locker.component.html',
  styleUrls: ['./locker.component.scss'],
})
export class LockerComponent implements OnInit {
  @Input() type: any;
  @Input() locker: any;
  @Output() open = new EventEmitter();
  @Output() return = new EventEmitter();

  waitOpenLocker: boolean;

  time = 3;
  timerSubscription: Subscription;

  checkShowExpireDateConfig = this.checkConfigLockersShowExpireDate(this.config.getConfig('lockerShowExpireDate'));
  constructor(
    private config: AppConfig,

  ) {}

  ngOnInit(): void {}

  openLocker(locker: any) {
    this.waitOpenLocker = true;

    this.timerSubscription = timer(1000, 1000).subscribe(() => {
      this.time -= 1;

      if (this.time === 0) {
        this.time = 3;
        this.waitOpenLocker = false;
        this.timerSubscription.unsubscribe();
        this.open.emit(this.locker);
      }
    });
  }

  cancelOpenLocker() {
    this.time = 3;
    this.waitOpenLocker = false;
    this.timerSubscription.unsubscribe();
  }

  relativeTime(time) {
    return dayjs(time).fromNow();
  }
  checkConfigLockersShowExpireDate(value){
    const checkConfig = value
    try {
        if(checkConfig != true){
            return false
        }else{
            if(checkConfig == true){
                return true
            }else{
                return false
            }
        }
    } catch (error) {
        console.log(error);
    }
  }
}
