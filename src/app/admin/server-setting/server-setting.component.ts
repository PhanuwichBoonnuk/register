import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { fadeAnimation } from '@shared/animations';

@Component({
  selector: 'app-server-setting',
  templateUrl: './server-setting.component.html',
  styleUrls: ['./server-setting.component.scss'],
  animations: [
    trigger('fade', [transition('* => *', [useAnimation(fadeAnimation)])]),
  ],
})
export class ServerSettingComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
