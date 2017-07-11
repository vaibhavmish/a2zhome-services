import { fakeAsync } from '@angular/core/testing';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService, LoaderService, LocalStorageService, BroadcastService } from '../../providers';
import { GLOBAL_CONSTANTS } from '../../global-constants';

enum CLIENT_TYPE {
  GOOGLE,
  FACEBOOK
};

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.css']
})
export class VerifyOtpComponent implements OnInit {
  clientType: CLIENT_TYPE;
  responseMessage: string;
  client: string;
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
  alertType = '';
  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private loaderService: LoaderService,
    private broadcastService: BroadcastService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.step = 2;
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      const name = params['name'];
      const email = params['email'];
      this.client = params['client'];
      if (id && name && email) {
        this.profileInfo.id = id;
        this.profileInfo.name = name;
        this.profileInfo.email = email;
        if (this.client.indexOf('google') > -1) {
          this.clientType = CLIENT_TYPE.GOOGLE;
        } else if (this.client.indexOf('facebook') > -1) {
          this.clientType = CLIENT_TYPE.FACEBOOK;
        }
      }
    });
  }

  getTitle(): string {
    if (this.step === 1) {
      this.title = 'Retrieving Profile Information..';
    } else if (this.step === 2) {
      this.title = 'Send OTP';
    } else if (this.step === 3) {
      this.title = 'Verify OTP';
    }
    return this.title;
  }

  sendOtp() {
    this.responseMessage = this.isMobilenumberValid();
    if (this.responseMessage === '') {
      this.loaderService.display(true);
      this.authService.sendOtp(this.inputMobileNo)
        .subscribe(res => {
          this.respOtp = res;
          this.step++;
          this.loaderService.display(false);
        });
    }
  }

  private isMobilenumberValid(): string {
    let errorMessage = '';
    this.alertType = 'ERROR';
    const validNumber = new RegExp('^[0-9]{10}$');
    if (!this.inputMobileNo) {
      errorMessage = 'Mobile number is Required';
    } else if (!validNumber.test(this.inputMobileNo)) {
      errorMessage = 'Mobile number must be 10 digits';
    }
    return errorMessage;
  }

  private isInputBlank(input: string, fieldName: string): string {
    let errorMessage = '';
    this.alertType = 'ERROR';
    if (!input) {
      errorMessage = `${fieldName} is Required`;
    }
    return errorMessage;
  }

  verifyOtp() {
    this.responseMessage = this.isInputBlank(this.inputOtp, 'OTP');
    if (this.responseMessage === '') {
      this.loaderService.display(true);
      this.authService.verifyOtp(this.inputOtp, this.respOtp.id)
        .subscribe(res => {
          if (res && res.message && res.message === 'matched') {
            this.alertType = 'SUCCESS';
            this.responseMessage = 'OTP verified.';
            this.saveUserInfo();
          } else if (['expired', 'not matched'].indexOf(res.message) > -1) {
            this.alertType = 'ERROR';
            this.responseMessage = `OTP ${res.message}`;
          }
          this.loaderService.display(false);
        });
    }
  }

  saveUserInfo() {
    this.responseMessage = 'Please wait...';
    this.profileInfo.mobile = this.inputMobileNo;
    this.authService.updateUser(this.profileInfo.id, this.profileInfo.mobile)
      .then(res => {
        this.setupUser();
      });
  }

  setupUser() {
    this.localStorageService.setItem(GLOBAL_CONSTANTS.LS_IS_LOGGED_IN, 'true');
    this.localStorageService.setItem(GLOBAL_CONSTANTS.LS_LOGGEDINUSERNAME, this.profileInfo.name);
    this.localStorageService.setItem(GLOBAL_CONSTANTS.LS_LOGIN_USER_DATA, JSON.stringify(this.profileInfo));
    this.responseMessage = 'Authentication is successful!!';
    this.broadcastService.broadcast(GLOBAL_CONSTANTS.BROASCAST_ISLOGGEDIN, true);
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 1000);
  }
}
