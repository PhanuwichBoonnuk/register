import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-pre-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class PreRegisterComponents implements OnInit {
  backgroundImagePath: string;
  registerFlag: boolean;

  constructor(private cdr: ChangeDetectorRef, private zone: NgZone) {}

  async ngOnInit(): Promise<void> {
    await this.openFistPage();
  }

  async openFistPage() {
    try {
      this.zone.run(() => {
        this.backgroundImagePath = './config/images/image-register.png';
        this.registerFlag = true;
        this.cdr.detectChanges();
      });
    } catch (e) {
      console.log(e);
    }
  }
}
