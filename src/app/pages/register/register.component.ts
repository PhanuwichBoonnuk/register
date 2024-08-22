import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthState } from '@core/store/auth/auth.reducer';
import { openFooter, closeFooter } from '../../layout/footer/footer.actions'; // ตรวจสอบให้แน่ใจว่าเส้นทางถูกต้อง

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
  constructor(
    private fb: FormBuilder,
    private Store: Store<AuthState>,

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
  async captCha(validateValue){
  try {
    
  } catch (e) {
   console.log(e);
  }
  }
  initializeForm(): void {
    const { formatIdPassport, formatPhoneNo } = this.formatValidate();
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: [''], 
      phone: ['', [Validators.required, Validators.pattern(/^\d{3}-\d{3}-\d{4}$/)]], // Phone number format: 123-456-7890
      company: [''],
      idPassport: ['', [Validators.required, Validators.pattern(/^\d-\d{4}-\d{5}-\d{2}-\d$/)]], 
      licensePlate: [''],
      hostEmail: ['']
    });

    // *** Format ID No./passport
    this.registerForm.get('idPassport')?.valueChanges.subscribe(value => {
      if (value) {
        this.registerForm.get('idPassport')?.setValue(formatIdPassport(value), { emitEvent: false });
      }
    });

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
  async onSubmit(): Promise<void> {
    const { open, close } = this.loading();
    open();
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      close();
      return
    } else {
      await this.captCha(this.registerForm);
      // ! ไม่ใช้ให้เอาออก
      this.registerFlag = false;
      this.Store.dispatch(closeFooter());
      close();
    }
  }
}
