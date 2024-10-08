import { Component, Input, OnInit } from '@angular/core';
import { PopupService } from './popup.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class PopupComponent implements OnInit {
  @Input()
  data: any;

  constructor(private popupService: PopupService) { }

  ngOnInit(): void { }

  confirm() {
    this.popupService.closeModal(true);
  }

  close() {
    this.popupService.closeModal(false);
  }
}
