import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FooterState } from './footer.reducer'; // ตรวจสอบเส้นทางให้ถูกต้อง

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class footerComponents implements OnInit {
  isFooterOpen$: Observable<boolean>;

  constructor(private store: Store<{ footer: FooterState }>) {}

  ngOnInit(): void {
    // เชื่อมต่อ state ของ footer กับตัวแปรใน component
    this.isFooterOpen$ = this.store.select(state => state.footer.isOpen);
  }
}
