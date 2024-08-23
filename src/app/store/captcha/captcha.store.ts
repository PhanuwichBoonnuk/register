export class CaptchaStore {
  private static instance: CaptchaStore;
  private captchaValue: string = '';

  private constructor() {}

  static getInstance(): CaptchaStore {
    if (!CaptchaStore.instance) {
      CaptchaStore.instance = new CaptchaStore();
    }
    return CaptchaStore.instance;
  }

  setCaptchaValue(value: string): void {
    this.captchaValue = value;
  }

  getCaptchaValue(): string {
    return this.captchaValue;
  }
}
