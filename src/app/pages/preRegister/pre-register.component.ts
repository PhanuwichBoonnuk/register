import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';

@Component({
  selector: 'app-pre-register',
  templateUrl: './pre-register.component.html',
  styleUrls: ['./pre-register.component.scss'],
})
export class PreRegisterComponents implements OnInit {

  // Implement ngOnInit method
  ngOnInit(): void {
    // Logic to execute when the component initializes
    console.log('PreRegisterComponents initialized');
  }

}
