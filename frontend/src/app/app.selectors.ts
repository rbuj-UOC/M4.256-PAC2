import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './Auth/reducers';

export const featureKey = 'app';

export const selectAuthState = createFeatureSelector<AuthState>(featureKey);

export const selectAccessToken = createSelector(
  selectAuthState,
  (state) => state.auth.access_token
);

export const selectUserId = createSelector(
  selectAuthState,
  (state) => state.auth.user_id
);

export const selectLoaded = createSelector(
  selectAuthState,
  (state) => state.loaded
);

export const selectLoading = createSelector(
  selectAuthState,
  (state) => state.loading
);
