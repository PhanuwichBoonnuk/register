import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-block-ui',
  templateUrl: './block-ui.component.html',
  styleUrls: ['./block-ui.component.scss'],
})
export class BloclUIComponents implements OnInit {
  @Input() isBlocked: boolean = false; 

  ngOnInit(): void {
    console.log('BlockUI component initialized');
  }
}
