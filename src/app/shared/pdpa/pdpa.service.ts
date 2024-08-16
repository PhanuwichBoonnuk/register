import { Injectable } from '@angular/core';
import { HttpCustom } from '@core/http-custom';

@Injectable({ providedIn: 'root' })
export class PdpaService {

    constructor(private http: HttpCustom) { }

    getPdpa() {
        return this.http.getData('/pdpa');
    }

    postPdpa(body) {
        return this.http.postData('/pdpa', body);
    }

}