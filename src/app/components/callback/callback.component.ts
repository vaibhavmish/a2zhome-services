import { GLOBAL_CONSTANTS } from './../../global-constants';
import { LocalStorageService } from './../../providers/local-storage.service';
import { Component, OnInit } from '@angular/core';

import { RequestCallback } from '../../models';
import { CommonService, LoaderService } from '../../providers';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {
  userData: RequestCallback = new RequestCallback();
  showForm = true;
  message: string;

  constructor(
    private commonService: CommonService,
    private localStorageService: LocalStorageService,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.showForm = true;
    this.userData.user_id = this.localStorageService.getItem(
      GLOBAL_CONSTANTS.LS_LOGIN_USER_DATA,
      '_id'
    );
    this.userData.name = this.localStorageService.getItem(
      GLOBAL_CONSTANTS.LS_LOGIN_USER_DATA,
      'name'
    );
    this.userData.email = this.localStorageService.getItem(
      GLOBAL_CONSTANTS.LS_LOGIN_USER_DATA,
      'email'
    );
    this.userData.location = this.localStorageService.getItem(
      GLOBAL_CONSTANTS.LS_CITY
    );
    this.userData.mobile = this.localStorageService.getItem(
      GLOBAL_CONSTANTS.LS_MOBILE
    );
  }

  submitRequestCallback(model: RequestCallback, isValid: boolean, f: any) {
    if (isValid) {
      this.loaderService.display(true);
      this.commonService.requestCallback(model).subscribe(
        res => {
          this.showForm = false;
          this.message = 'Thank You!! We will contact you soon.';
          this.loaderService.display(false);
        },
        err => {
          this.loaderService.display(false);
        }
      );
    }
  }
}
