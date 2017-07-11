import { Component, OnInit } from '@angular/core';

import { AuthService, LoaderService } from '../../providers';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  successMessage: string;
  errorMessage: string;
  emailId: string;
  constructor(private authService: AuthService,
    private loaderService: LoaderService) { }

  ngOnInit() {
  }

  resetPassword(isValid: boolean) {
    this.errorMessage = '';
    this.successMessage = '';
    if (isValid) {
      this.loaderService.display(true);
      this.authService.resetPassword(this.emailId)
        .subscribe(res => {
          if (res.toLowerCase().indexOf('reset link sent') > -1) {
            this.successMessage = `${res}.`;
          }
          if (res.toLowerCase().indexOf('email not found') > -1) {
            this.errorMessage = `${res}. Please enter correct email-address`;
          }
          this.loaderService.display(false);
        },
        err => {
          this.loaderService.display(false);
        });
    }
  }
}
