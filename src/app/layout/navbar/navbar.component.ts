import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  
})
export class NavbarComponents implements OnInit {

  ngOnInit(): void {
    // Logic to execute when the component initializes
    console.log('app-navbar');
  }
}
