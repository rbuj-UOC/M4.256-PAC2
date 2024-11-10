import { createReducer, on } from '@ngrx/store';
import { AuthDTO } from './Models/auth.dto';
import { login, loginFailure, loginSuccess } from './auth.action';

export interface AuthState {
  auth: AuthDTO | undefined;
  loading: boolean;
  loaded: boolean;
  error: any;
}

const initialState: AuthState = {
  auth: undefined,
  loading: false,
  loaded: false,
  error: null
};

/*
export const authReducer = createReducer(initialState);
*/

export const authReducer = createReducer(
  initialState,
  on(login, (state) => ({ ...state, loading: true })),
  on(loginSuccess, (state, { auth }) => ({
    ...state,
    auth,
    loading: false
  })),
  on(loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
