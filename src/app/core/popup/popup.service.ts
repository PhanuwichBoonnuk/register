import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  constructor(private injector: Injector) {}

  private _popupData = new BehaviorSubject<any>(null);
  private _openModal = new BehaviorSubject<any>(false);
  private _statusValue: BehaviorSubject<any>;

  get isOpen(): Observable<boolean> {
    return this._openModal.asObservable();
  }

  get popupData(): Observable<any> {
    return this._popupData.asObservable();
  }

  get statisValue(): Observable<boolean> {
    return this._statusValue.asObservable();
  }

  openModal(data) {
    this._popupData.next(data);
    this._statusValue = new BehaviorSubject(null);
    this._openModal.next(true);
    return this._statusValue.pipe(
      filter((value) => (value !== null ? true : false))
    );
  }

  closeModal(data) {
    this._openModal.next(false);
    this._statusValue.next(data);
  }
}
