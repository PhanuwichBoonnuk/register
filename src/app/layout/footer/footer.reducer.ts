import { createReducer, on } from '@ngrx/store';
import { openFooter, closeFooter } from './footer.actions';

export interface FooterState {
  isOpen: boolean;
}

export const initialFooterState: FooterState = {
  isOpen: true, // ค่าเริ่มต้นให้ footer เปิดอยู่
};

export const footerReducer = createReducer(
  initialFooterState,
  on(openFooter, state => ({ ...state, isOpen: true })),
  on(closeFooter, state => ({ ...state, isOpen: false }))
);
