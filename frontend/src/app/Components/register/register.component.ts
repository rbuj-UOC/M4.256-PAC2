import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { finalize } from 'rxjs/operators';
import { UserDTO } from 'src/app/Models/user.dto';
import { SharedService } from 'src/app/Services/shared.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerUser: UserDTO;

  name: UntypedFormControl;
  surname_1: UntypedFormControl;
  surname_2: UntypedFormControl;
  alias: UntypedFormControl;
  birth_date: UntypedFormControl;
  email: UntypedFormControl;
  password: UntypedFormControl;

  registerForm: UntypedFormGroup;
  isValidForm: boolean | null;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private userService: UserService,
    private sharedService: SharedService,
    private store: Store,
    private router: Router
  ) {
    this.registerUser = new UserDTO('', '', '', '', new Date(), '', '');

    this.isValidForm = null;

    this.name = new UntypedFormControl(this.registerUser.name, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25)
    ]);

    this.surname_1 = new UntypedFormControl(this.registerUser.surname_1, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25)
    ]);

    this.surname_2 = new UntypedFormControl(this.registerUser.surname_2, [
      Validators.minLength(5),
      Validators.maxLength(25)
    ]);

    this.alias = new UntypedFormControl(this.registerUser.alias, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25)
    ]);

    this.birth_date = new UntypedFormControl(
      formatDate(this.registerUser.birth_date, 'yyyy-MM-dd', 'en'),
      [Validators.required]
    );

    this.email = new UntypedFormControl(this.registerUser.email, [
      Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')
    ]);

    this.password = new UntypedFormControl(this.registerUser.password, [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16)
    ]);

    this.registerForm = this.formBuilder.group({
      name: this.name,
      surname_1: this.surname_1,
      surname_2: this.surname_2,
      alias: this.alias,
      birth_date: this.birth_date,
      email: this.email,
      password: this.password
    });
  }

  register(): void {
    let responseOK = false;
    this.isValidForm = false;
    let errorResponse: any;

    if (this.registerForm.invalid) {
      return;
    }
    this.isValidForm = true;
    this.registerUser = this.registerForm.value;
    this.userService
      .register(this.registerUser)
      .pipe(
        finalize(() => {
          this.sharedService
            .managementToast('registerFeedback', responseOK, errorResponse)
            .finally(() => {
              if (responseOK) {
                // Reset the form
                this.registerForm.reset();
                // After reset form we set birthDate to today again (is an example)
                this.birth_date.setValue(
                  formatDate(new Date(), 'yyyy-MM-dd', 'en')
                );
                this.router.navigateByUrl('home');
              }
            });
        })
      )
      .subscribe(
        () => {
          responseOK = true;
        },
        (error: any) => {
          responseOK = false;
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      );
  }
}
