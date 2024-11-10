import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { login, loginFailure, loginSuccess } from './auth.action';
import { AuthDTO } from './Models/auth.dto';
import { AuthService } from './Services/auth.service';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(login),
      exhaustMap((action) =>
        this.authService.login(action.auth).pipe(
          map((token) =>
            loginSuccess({
              auth: new AuthDTO(token.user_id, token.access_token, '', '')
            })
          ),
          catchError((error) => of(loginFailure({ error })))
        )
      )
    );
  });

  constructor(
    private actions$: Actions,
    private authService: AuthService
  ) {}
}
