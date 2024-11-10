import { ActionReducerMap } from '@ngrx/store';
import * as reducers from './Auth/reducers';

export interface AppState {
  app: reducers.AuthState;
}

export const appReducers: ActionReducerMap<AppState> = {
  app: reducers.authReducer
};
