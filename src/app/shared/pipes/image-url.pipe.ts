import { Pipe, PipeTransform } from '@angular/core';
import { AppConfig } from '@config';

@Pipe({
  name: 'imageUrl',
})
export class ImageUrlPipe implements PipeTransform {
  constructor(private config: AppConfig) {}

  transform(value: string) {
    if (value && value[0] === '/') {
      let imageUrl = this.config.getConfig('imageUrl');
      const apiUrl = this.config.getConfig('apiUrl');
      if (!imageUrl && apiUrl) {
        imageUrl = apiUrl;
      } else if (!imageUrl && !apiUrl) {
        const port = this.config.getConfig('apiPort')
          ? this.config.getConfig('apiPort')
          : '8899';
        imageUrl =
          window.location.protocol +
          '//' +
          window.location.hostname +
          ':' +
          port;
      }
      return imageUrl + value;
    } else if (value && value[0] !== '/') {
      return value;
    }
    return './assets/images/no-image.png';
  }
}
