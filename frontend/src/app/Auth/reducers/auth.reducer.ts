import { createReducer, on } from '@ngrx/store';
import { login, loginFailure, loginSuccess, logout } from '../actions';
import { AuthDTO } from '../models/auth.dto';

export interface AuthState {
  auth: AuthDTO;
  loading: boolean;
  loaded: boolean;
  error: any;
}

const emptyAuth: AuthDTO = {
  user_id: null,
  access_token: null,
  email: null,
  password: null
};

const initialState: AuthState = {
  auth: emptyAuth,
  loading: false,
  loaded: false,
  error: null
};

export const authReducer = createReducer(
  initialState,
  on(login, (state) => ({
    ...state,
    loaded: false,
    loading: true
  })),
  on(loginSuccess, (state, { auth }) => ({
    ...state,
    auth,
    loaded: true,
    loading: false
  })),
  on(loginFailure, (state, { error }) => ({
    ...state,
    loaded: true,
    loading: false,
    error
  })),
  on(logout, (state) => initialState)
);
