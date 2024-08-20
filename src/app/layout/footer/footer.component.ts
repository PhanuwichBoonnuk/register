import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  
})
export class footerComponents implements OnInit {

  ngOnInit(): void {
    // Logic to execute when the component initializes
    console.log('app-navbar');
  }
}
