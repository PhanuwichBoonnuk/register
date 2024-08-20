import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';

@Component({
  selector: 'app-pre-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class PreRegisterComponents implements OnInit {
  backgroundImagePath: string;

  constructor() {}

  ngOnInit(): void {
    this.backgroundImagePath = './config/images/image-register.png';
  }

}
