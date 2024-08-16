import { Injectable } from '@angular/core';
import { HttpCustom } from '@core/http-custom';

@Injectable({
  providedIn: 'root',
})
export class PanelService {
  constructor(private http: HttpCustom) {}

  getPanels() {
    return this.http.get('/panels');
  }

  getPanelById(panelId: string) {
    return this.http.get('/panels/' + panelId);
  }

  createPanel(data: any) {
    return this.http.post('/panels', data);
  }

  updatePanel(panelId: string, data: any) {
    return this.http.put('/panels/' + panelId, data);
  }

  deletePanel(panelId: string) {
    return this.http.delete('/panels/' + panelId);
  }
}
