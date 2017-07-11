import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, LoaderService, LocalStorageService, BroadcastService } from '../../providers';

import { LoginUserRequest, LoginUserResponse } from '../../models';
import { GLOBAL_CONSTANTS } from '../../global-constants';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  loginUser: LoginUserRequest = new LoginUserRequest();
  errorMessage: string;
  isLoggedIn = false;
  alertType = 'danger';
  returnUrl: string;
  client: string;
  token: string;

  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private loaderService: LoaderService,
    private broadcastService: BroadcastService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['code'];
      this.client = params['client'];
      if (this.token) {
        if (this.client.indexOf('google') > -1) {
          this.authService.authGoogle(this.token).subscribe(res => {
            this.setupUser(res);
          });
        }
      }
    });

  }

  signIn(form: any, isFormValid: boolean) {
    this.errorMessage = '';
    this.alertType = 'danger';
    this.isLoggedIn = false;
    if (isFormValid) {
      this.loaderService.display(true);
      this.authService.loginUser(this.loginUser)
        .subscribe(
        res => {
          if (res.message === GLOBAL_CONSTANTS.USER_NOT_FOUND) {
            this.errorMessage = 'Invalid Email or Password';
          } else if (res.message === GLOBAL_CONSTANTS.INVALID_PASSWORD) {
            this.errorMessage = 'Invalid Email or Password';
          } else if (res.message === GLOBAL_CONSTANTS.SUCCESS) {
            this.setupUser(res);
          }
        },
        err => {
          localStorage.setItem(GLOBAL_CONSTANTS.LS_IS_LOGGED_IN, 'false');
          this.errorMessage = 'Invalid Email or Password';
          this.loaderService.display(false);
        },
        () => {
          this.loaderService.display(false);
        }
        );
    } else {
      this.errorMessage = 'E-mail and Password are required';
    }
  }

  setupUser(res: any) {
    localStorage.setItem(GLOBAL_CONSTANTS.LS_IS_LOGGED_IN, 'true');
    localStorage.setItem(GLOBAL_CONSTANTS.LS_LOGGEDINUSERNAME, res.name);
    localStorage.setItem(GLOBAL_CONSTANTS.LS_LOGIN_USER_DATA, JSON.stringify(res));
    this.isLoggedIn = true;
    this.broadcastService.broadcast(GLOBAL_CONSTANTS.BROASCAST_ISLOGGEDIN, this.isLoggedIn);
    const redirectUrl = this.authService.redirectUrl || '/';
    this.authService.redirectUrl = null;
    this.router.navigate([redirectUrl]);
  }
  
  googleLogin() {
    this.authService.auth('google');
  }

  facebookLogin() {
    this.authService.auth('facebook');
  }

}
