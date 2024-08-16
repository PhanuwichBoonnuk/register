import { AuthActions, AuthActionTypes } from './auth.actions';

export interface AuthState {
  auth: AuthData;
}

export interface AuthData {
  isLoggedIn: boolean;
  user: any;
  scopeObject: any;
  scopes: string[];
  returnUrl: string;
}

export const initialState: AuthData = {
  isLoggedIn: false,
  user: null,
  scopeObject: {},
  scopes: [],
  returnUrl: null,
};

export function reducer(state = initialState, action: AuthActions): AuthData {
  switch (action.type) {
    case AuthActionTypes.LoadAuths:
      return state;

    case AuthActionTypes.Login:
      return {
        ...state,
        isLoggedIn: true,
        user: action.user,
        scopes: action.scopes,
        scopeObject: action.scopes.reduce(
          (acc, cur) => ((acc[cur.split('.')[0]] = cur.split('.')[1]), acc),
          {}
        ),
      };

    case AuthActionTypes.UpdateUserDetails:
      return {
        ...state,
        user: action.user,
        scopes: action.scopes,
        scopeObject: action.scopes,
      };

    case AuthActionTypes.Logout:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
        scopes: [],
        scopeObject: null,
        returnUrl: null,
      };

    case AuthActionTypes.TokenExpired:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
        scopes: [],
        scopeObject: null,
        returnUrl: null,
      };

    case AuthActionTypes.UpdateReturnUrl:
      return { ...state, returnUrl: action.returnUrl };

    default:
      return state;
  }
}
