import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CaptchaStore } from '../../store/captcha/captcha.store';
import { CaptchaService } from '../../store/captcha/captcha.service';

@Component({
  selector: 'app-captcha',
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.scss'],
})
export class CaptchaComponent implements OnInit {
  maxLengthInput: number = 6;
  @Input() config: any = {
    type: 1,
    length: this.maxLengthInput,
    cssClass: 'custom',
    back: {
      stroke: '#8391a2',
      solid: '#f0f4ff',
    },
    font: {
      color: '#3d4f95',
      size: '40px',
      family: 'Arial',
    },
  };
  @Output() captchaCode = new EventEmitter<string>();

  captch_input: string = '';
  code: string = '';
  isCaptchaValid: boolean = true;

  ngOnInit(): void {
    this.createCaptcha();
  }

  createCaptcha() {
    let char = Math.random()
      .toString(36)
      .substring(2, 2 + this.config.length)
      .toUpperCase();

    this.code = char;
    CaptchaStore.getInstance().setCaptchaValue(this.code);

    let captchaCanvas: any = document.getElementById('captchaCanvas');
    var ctx = captchaCanvas.getContext('2d');

    ctx.clearRect(0, 0, captchaCanvas.width, captchaCanvas.height);
    ctx.fillStyle = this.config.back.solid;
    ctx.fillRect(0, 0, captchaCanvas.width, captchaCanvas.height);

    ctx.font = `${this.config.font.size} ${this.config.font.family}`;
    ctx.fillStyle = this.config.font.color;
    ctx.textBaseline = 'middle';

    const textWidth = ctx.measureText(this.code).width;
    const startX = (captchaCanvas.width - textWidth) / 2;
    const startY = captchaCanvas.height / 2 + 10;

    ctx.fillText(this.code, startX, startY);

    if (this.config.back.stroke) {
      ctx.beginPath();
      ctx.strokeStyle = this.config.back.stroke;
      for (var i = 0; i < 100; i++) {
        ctx.moveTo(Math.random() * captchaCanvas.width, Math.random() * captchaCanvas.height);
        ctx.lineTo(Math.random() * captchaCanvas.width, Math.random() * captchaCanvas.height);
      }
      ctx.stroke();
    }
  }

  checkCaptcha(): boolean {
    this.isCaptchaValid = CaptchaService.checkCaptcha(this.captch_input);
    console.log(this.isCaptchaValid); // ดูว่าค่าของ isCaptchaValid เปลี่ยนเป็น false หรือไม่
    if (!this.isCaptchaValid) {
      this.captch_input = ''; // ล้างค่า input ถ้าไม่ถูกต้อง
    }
    return this.isCaptchaValid;
  }
  
  

  reloadCaptchaOnFail(): void {
    this.createCaptcha(); // สร้าง CAPTCHA ใหม่
    this.captch_input = ''; // รีเซ็ตค่า input ที่ผู้ใช้กรอก
    // ไม่ต้องรีเซ็ต isCaptchaValid ให้ผู้ใช้เห็นว่าฟิลด์นี้มีข้อผิดพลาด
  }

  manualReloadCaptcha(): void {
    this.createCaptcha(); // สร้าง CAPTCHA ใหม่
    this.captch_input = ''; // รีเซ็ตค่า input ที่ผู้ใช้กรอก
    this.isCaptchaValid = true; // รีเซ็ตสถานะการตรวจสอบเมื่อรีโหลด CAPTCHA ใหม่
  }
}
