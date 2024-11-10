import { createAction, props } from '@ngrx/store';
import { AuthDTO } from './Models/auth.dto';

export const login = createAction(
  '[Login] User Login',
  props<{ auth: AuthDTO }>()
);

export const loginSuccess = createAction(
  '[Login] Login Success',
  props<{ auth: AuthDTO }>()
);

export const loginFailure = createAction(
  '[Login] Login Failure',
  props<{ error: any }>()
);
