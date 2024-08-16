import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as dayjs from 'dayjs';

@Pipe({
  name: 'dateFormat',
})
export class DateFormatPipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(value: any, format: string): unknown {
    const lang = this.translateService.currentLang;
    // return dayjs(value).locale(lang).format(format);
    return dayjs(value).format(format);
  }
}
