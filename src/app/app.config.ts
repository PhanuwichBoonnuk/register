import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class AppConfig {
  private config: Object = null;

  loadedConfig: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  public getLoadedConfig() {
    return this.loadedConfig.asObservable();
  }

  public getConfig(key: any) {
    return this.config[key];
  }

  public load() {
    return new Promise((resolve, reject) => {
      this.http.get('./config/config.json').subscribe((data) => {
        this.config = data;
        this.loadedConfig.next(true);
        resolve(true);
      });
    });
  }
}

export function loadConfiguration(config: AppConfig) {
  return () => config.load();
}
