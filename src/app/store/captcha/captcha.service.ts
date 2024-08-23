import { CaptchaStore } from './captcha.store';

export class CaptchaService {
    static checkCaptcha(input: string): boolean {
        const storedCaptcha = CaptchaStore.getInstance().getCaptchaValue();
        
        if (input === undefined || input === null) {
            // ถ้า input เป็น undefined หรือ null ไม่ต้องทำอะไรและส่งกลับ false
            return false;
        }

        if (!storedCaptcha) {
            // ถ้า storedCaptcha เป็น undefined หรือ null ส่งกลับ false
            return false;
        }

        if (input.toUpperCase() !== storedCaptcha.toUpperCase()) {
            // ถ้า input ไม่ถูกต้อง เคลียร์ input แล้วส่งกลับ false
            input = '';  // ล้างค่า input
            return false;
        }

        // ถ้า input ตรงกับ storedCaptcha ส่งกลับ true
        return true;
    }
}
