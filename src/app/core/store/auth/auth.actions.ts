import { Action } from '@ngrx/store';

export enum AuthActionTypes {
  LoadAuths = '[Auth] Load Auths',
  LoadAuthFail = '[Auth] Load Auth Fail',
  Login = '[Auth] Login',
  Logout = '[Auth] Logout',
  TokenExpired = '[Auth] Token Expired',
  UpdateUserDetails = '[Auth] Update User Details',
  LoadReturnUrl = '[Auth] Load Return Url',
  UpdateReturnUrl = '[Auth] Update Return Url',
}

export class LoadAuths implements Action {
  readonly type = AuthActionTypes.LoadAuths;
}

export class LoadAuthFail implements Action {
  readonly type = AuthActionTypes.LoadAuthFail;
}

export class Login implements Action {
  readonly type = AuthActionTypes.Login;
  constructor(public user: any, public scopes: any) {}
}

export class Logout implements Action {
  readonly type = AuthActionTypes.Logout;
}

export class TokenExpired implements Action {
  readonly type = AuthActionTypes.TokenExpired;
}

export class UpdateUserDetails implements Action {
  readonly type = AuthActionTypes.UpdateUserDetails;
  constructor(public user: any, public scopes: any) {}
}

export class LoadReturnUrl implements Action {
  readonly type = AuthActionTypes.LoadReturnUrl;
}

export class UpdateReturnUrl implements Action {
  readonly type = AuthActionTypes.UpdateReturnUrl;
  constructor(public returnUrl: string) {}
}

export type AuthActions =
  | LoadAuths
  | LoadAuthFail
  | Login
  | Logout
  | TokenExpired
  | UpdateUserDetails
  | UpdateReturnUrl;
