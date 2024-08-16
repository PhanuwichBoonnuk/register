import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QrcodeService } from '@shared/service/qrcode.service';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-my-qr',
  templateUrl: './my-qr.component.html',
  styleUrls: ['./my-qr.component.scss'],
})
export class MyQrComponent implements OnInit {
  qrCode$ = new Observable();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private qrCodeService: QrcodeService
  ) {}

  ngOnInit(): void {
    this.getQrCode();
  }

  getQrCode() {
    this.qrCode$ = this.qrCodeService.getQrCode();
  }

  cancel() {
    this.router.navigate(['.'], { relativeTo: this.route.parent });
  }
}
