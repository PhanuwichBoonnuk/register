import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pre-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class PreRegisterComponents implements OnInit {
  backgroundImagePath: string;
  registerFlag: boolean;
  registerForm: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    this.openFistPage();
  }


  async openFistPage() {
    this.backgroundImagePath = './config/images/image-register.png';
    this.registerFlag = true;
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

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      console.log('Form is not valid');
    } else {
      console.log(this.registerForm.value);

    }
  }
}
