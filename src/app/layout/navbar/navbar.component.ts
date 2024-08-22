import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponents implements OnInit {

  constructor(private translate: TranslateService) {
    // ตั้งค่าภาษาเริ่มต้น
    this.translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    // Logic to execute when the component initializes
  }

  switchLanguage(event: any) {
    const language = event.target.value;
    this.translate.use(language);
  }
}
