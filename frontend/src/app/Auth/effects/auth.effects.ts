import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { SharedService } from '../../Services/shared.service';
import { login, loginFailure, loginSuccess, logout } from '../actions';
import { AuthDTO } from '../models/auth.dto';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private sharedService = inject(SharedService);
  private router = inject(Router);

  login$: any;
  loginSuccess$: any;
  loginFailure$: any;
  logout$: any;

  constructor() {
    this.login$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(login),
        exhaustMap((action) =>
          this.authService.login(action.auth).pipe(
            map((token) =>
              loginSuccess({
                auth: new AuthDTO(token.user_id, token.access_token, null, null)
              })
            ),
            catchError((error) => of(loginFailure({ error })))
          )
        )
      );
    });

    this.loginSuccess$ = createEffect(
      () => {
        return this.actions$.pipe(
          ofType(loginSuccess),
          map(() => {
            this.sharedService
              .managementToast('loginFeedback', true)
              .finally(() => {
                this.router.navigateByUrl('home');
              });
          })
        );
      },
      { dispatch: false }
    );

    this.loginFailure$ = createEffect(
      () => {
        return this.actions$.pipe(
          ofType(loginFailure),
          map((err) =>
            this.sharedService.managementToast(
              'loginFeedback',
              false,
              err.error
            )
          )
        );
      },
      { dispatch: false }
    );

    this.logout$ = createEffect(
      () => {
        return this.actions$.pipe(
          ofType(logout),
          map(() => this.router.navigateByUrl('home'))
        );
      },
      { dispatch: false }
    );
  }
}
