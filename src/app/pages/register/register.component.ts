import { AppConfig } from '@config';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthState } from '@core/store/auth/auth.reducer';
import { openFooter, closeFooter } from '../../layout/footer/footer.actions'; // ตรวจสอบให้แน่ใจว่าเส้นทางถูกต้อง
import { CaptchaComponent } from '../../layout/captcha/captcha.component'; // นำเข้า CaptchaComponent

@Component({
  selector: 'app-pre-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class PreRegisterComponents implements OnInit {
  backgroundImagePath: string;
  successImagePath:string;
  logoImagePath:string;
  registerFlag: boolean;
  registerForm: FormGroup;
  isLoading:boolean;

  // !TEXT HTML
  registerPage = this.config.getConfig('registerPage');

  @ViewChild(CaptchaComponent) captchaComponent!: CaptchaComponent;
  constructor(
    private fb: FormBuilder,
    private Store: Store<AuthState>,
    private config: AppConfig,

  ) {}

  ngOnInit(): void {
    this.openFistPage();
  }

  async openFistPage() {
    const { open, close } = this.loading();
    open();
    this.registerFlag = true;
    this.initializeForm();
    this.successImagePath = '/assets/images/success.png';
    this.backgroundImagePath = './config/images/image-register.png';
    this.logoImagePath = './config/images/logo-brand.png';
    this.Store.dispatch(openFooter());
    await new Promise(resolve => setTimeout(resolve, 1000));
    close();
  }
  async router_register(){
    await this.openFistPage();
  }
  initializeForm(): void {
    const { formatIdPassport, formatPhoneNo } = this.formatValidate();
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Zก-๙]+$/)]], 
      lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Zก-๙]+$/)]],
      email: [''], 
      phone: ['', [Validators.required, Validators.pattern(/^\d{3}-\d{3}-\d{4}$/)]], 
      company: [''],
      idPassport: ['', [Validators.required]],
      licensePlate: [''],
      hostEmail: ['']
    });

    // // *** Format ID No./passport
    // this.registerForm.get('idPassport')?.valueChanges.subscribe(value => {
    //   if (value) {
    //     this.registerForm.get('idPassport')?.setValue(formatIdPassport(value), { emitEvent: false });
    //   }
    // });

    // *** Format Phone No.
    this.registerForm.get('phone')?.valueChanges.subscribe(value => {
      if (value) {
        this.registerForm.get('phone')?.setValue(formatPhoneNo(value), { emitEvent: false });
      }
    });
  }
  formatValidate() {
    const formatIdPassport = (value: string): string => {
      const cleanValue = value.replace(/\D/g, ''); 
      if (cleanValue.length <= 13) {
        return cleanValue.replace(/(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/, '$1-$2-$3-$4-$5');
      }
      return value;
    };

    const formatPhoneNo = (value: string): string => {
      const cleanValue = value.replace(/\D/g, '');
      if (cleanValue.length <= 10) {
        return cleanValue.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
      }
      return value; 
    };
    return { formatIdPassport, formatPhoneNo };
  }
  loading(){
    const open = () => {
      this.isLoading = true;
    }
    const close = () => {
      this.isLoading = false;
    }
    return {open,close}
  }
  async captCha(): Promise<boolean> {
    const isCaptchaValid = this.captchaComponent.checkCaptcha();
    if (!isCaptchaValid) {
      this.captchaComponent.reloadCaptchaOnFail();
    }
    return isCaptchaValid;
  }
  
  
  async onSubmit(): Promise<void> {
    const { open, close } = this.loading();
    open();
  
    await new Promise(resolve => setTimeout(resolve, 1000));
  
    const checkCaptCha = await this.captCha();
  
    if (checkCaptCha && !this.registerForm.invalid) {
      this.registerFlag = false;
      this.Store.dispatch(closeFooter());
    } else {
      this.registerForm.markAllAsTouched();
      this.captchaComponent.reloadCaptchaOnFail();
    }
    close();
  }
  
  
}
