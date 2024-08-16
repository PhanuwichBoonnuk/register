import { AuthState } from './auth.reducer';
import { createSelector } from '@ngrx/store';

export const userSelector = (s: AuthState) => s.auth.user;
export const scopesSelector = (s: AuthState) => s.auth.scopes;
export const scopeObjectSelector = (s: AuthState) => s.auth.scopeObject;
export const isLoggedInSelector = (s: AuthState) => s.auth.isLoggedIn;
export const returnUrlSelector = (s: AuthState) => s.auth.returnUrl;
