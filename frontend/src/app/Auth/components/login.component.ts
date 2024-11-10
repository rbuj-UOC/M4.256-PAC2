import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { login } from '../actions';
import { AuthDTO } from '../models/auth.dto';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginUser: AuthDTO;
  email: UntypedFormControl;
  password: UntypedFormControl;
  loginForm: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private store: Store
    /*
    private authService: AuthService,
    private sharedService: SharedService,
    private headerMenusService: HeaderMenusService,
    private localStorageService: LocalStorageService,
    private router: Router
*/
  ) {
    this.loginUser = new AuthDTO('', '', '', '');

    this.email = new UntypedFormControl('', [
      Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')
    ]);

    this.password = new UntypedFormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16)
    ]);

    this.loginForm = this.formBuilder.group({
      email: this.email,
      password: this.password
    });
  }

  login(): void {
    const auth = new AuthDTO('', '', this.email.value, this.password.value);
    this.store.dispatch(login({ auth }));
  }
}
