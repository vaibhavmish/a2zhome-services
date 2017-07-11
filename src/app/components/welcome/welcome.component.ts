import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService, LoaderService, SessionStorageService, BroadcastService } from '../../providers';
import { GLOBAL_CONSTANTS } from '../../global-constants';

enum CLIENT_TYPE {
  GOOGLE,
  FACEBOOK
};

@Component({
  selector: 'app-verify-otp',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  clientType: CLIENT_TYPE;
  responseMessage: string;
  alertType = '';
  client: string;
  token: string;
  title: string;
  step: number;
  inputMobileNo: string;
  inputOtp: string;
  respOtp: { id: '', otp: '' };
  profileInfo = {
    id: '',
    name: '',
    email: '',
    mobile: ''
  };
  otpVerified = false;
  submitBtnText: string;

  constructor(
    private authService: AuthService,
    private sessionStorageService: SessionStorageService,
    private loaderService: LoaderService,
    private broadcastService: BroadcastService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.step = 1;
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    } else {
      this.route.queryParams.subscribe(params => {
        this.token = params['code'];
        this.client = params['client'];
        if (this.token) {
          if (this.client.indexOf('google') > -1) {
            this.clientType = CLIENT_TYPE.GOOGLE;
            this.authService.authGoogle(this.token).subscribe(res => {
              this.setupPage(res);
            },
              err => {
                this.alertType = 'ERROR';
                this.submitBtnText = 'Go to Home';
                this.responseMessage = `${err}`;
                this.step++;
              });
          } else if (this.client.indexOf('facebook') > -1) {
            this.clientType = CLIENT_TYPE.FACEBOOK;
            this.authService.authFacebook(this.token).subscribe(res => {
              this.setupPage(res);
            },
              err => {
                this.alertType = 'ERROR';
                this.submitBtnText = 'Go to Home';
                this.responseMessage = `${err}`;
                this.step++;
              });
          }
        }
      });
    }
  }

  setupPage(res: any) {
    this.profileInfo.id = res._id;
    this.profileInfo.name = res.name;
    this.profileInfo.email = res.email;
    if (res.hasOwnProperty('number') && res.number && res.number > 0) {
      localStorage.setItem(GLOBAL_CONSTANTS.LS_LOGIN_USER_DATA, JSON.stringify(res));
      this.otpVerified = true;
      this.profileInfo.mobile = res.number;
      localStorage.setItem(GLOBAL_CONSTANTS.LS_IS_LOGGED_IN, 'true');
      localStorage.setItem(GLOBAL_CONSTANTS.LS_LOGGEDINUSERNAME, this.profileInfo.name);
      this.broadcastService.broadcast(GLOBAL_CONSTANTS.BROASCAST_ISLOGGEDIN, true);
      this.alertType = 'SUCCESS';
      this.responseMessage = `Authentication is successful!`;
      this.submitBtnText = 'Go to Home';
    } else {
      this.otpVerified = false;
      this.submitBtnText = 'Proceed with OTP Verification';
    }
    this.step++;
  }

  goToNext() {
    if (this.otpVerified) {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/verify-otp'], { queryParams: { client: this.client, id: this.profileInfo.id, name: this.profileInfo.name, email: this.profileInfo.email } });
    }
  }

  getTitle(): string {
    if (this.step === 1) {
      this.title = 'Retrieving Profile Information..';
    } else {
      this.title = 'Profile Details';
    }
    return this.title;
  }

}
