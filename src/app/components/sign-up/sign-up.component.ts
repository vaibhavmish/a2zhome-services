import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService, LoaderService, LocalStorageService, BroadcastService } from '../../providers';

import { RegisterUserRequest, RegisterUserResponse } from '../../models';
import { GLOBAL_CONSTANTS } from '../../global-constants';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  responseMessage: string;
  classType: string;
  registerUser: RegisterUserRequest = new RegisterUserRequest();

  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private loaderService: LoaderService,
    private broadcastService: BroadcastService,
    private router: Router
  ) {
  }


  ngOnInit() {
  }

  signUp(model: RegisterUserRequest, IsValid: boolean) {
    this.classType = 'error-textbox';
    this.responseMessage = '';
    if (IsValid) {
      this.loaderService.display(true);
      this.authService.registerUser(this.registerUser)
        .subscribe(
        res => {
          if (res.message === GLOBAL_CONSTANTS.EMAIL_TAKEN) {
            this.responseMessage = 'Email already exists.';
          } else if (res.message === GLOBAL_CONSTANTS.SUCCESS) {
            this.classType = 'success-textbox';
            this.responseMessage = 'Thank you for the registration!';
            this.loaderService.display(false);
          }
        },
        err => {
          this.responseMessage = err;
          this.loaderService.display(false);
        },
        () => {
          this.loaderService.display(false);
        }
        );
    } else {
      this.responseMessage = this.validateForm(model);
    }
  }

  private validateForm(model: RegisterUserRequest): string {
    let errorMessage: string;
    const validEmail = new RegExp('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$');
    const validNumber = new RegExp('^[0-9]{10}$');
    if (!model.name || !model.email || !model.pass || !model.number) {
      errorMessage = 'All fields are mandatory';
    } else if (!validEmail.test(model.email)) {
      errorMessage = 'email is invalid';
    } else if (!validNumber.test(model.number)) {
      errorMessage = 'Mobile number must be 10 digits';
    }
    return errorMessage;
  }
}
