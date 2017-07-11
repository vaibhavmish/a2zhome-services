import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { GLOBAL_CONSTANTS } from './../../global-constants';
import { LocationService, LocalStorageService, CommonService, LoaderService } from '../../providers';
import { Location, Message } from '../../models';

@Component({
  selector: 'app-comp-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent implements OnInit {
  locationData: Location[];
  messageData: Message;
  responseMessage: string;
  alertType: string;

  constructor(
    private changeDetectRef: ChangeDetectorRef,
    private locationService: LocationService,
    private commonService: CommonService,
    private localStorageService: LocalStorageService,
    private loaderService: LoaderService
  ) { }

  ngOnInit() {
    this.messageData = new Message();
    this.fetchLocationList();
  }

  fetchLocationList = () => {
    this.locationService.getLocations()
      .subscribe(res => {
        this.locationData = res;
        this.changeDetectRef.detectChanges();
      });
  }

  saveMessage(isValid: boolean) {
    this.alertType = 'error-textbox';
    this.responseMessage = this.getValidationErrorMessage();
    if (this.responseMessage === '') {
      this.loaderService.display(true);
      this.messageData.location = this.localStorageService.getItem(GLOBAL_CONSTANTS.LS_CITY);
      this.commonService.saveMessage(this.messageData)
        .subscribe(res => {
          this.alertType = 'success-textbox';
          if (res === 'saved') {
            this.resetForm();
            this.responseMessage = 'Message submitted successfully!';
            this.changeDetectRef.detectChanges();
          }
          this.loaderService.display(false);
        },
        err => {
          this.loaderService.display(false);
        });
    }
  }

  resetForm() {
    this.messageData.email = '';
    this.messageData.message = '';
    this.messageData.name = '';
    this.messageData.phone = '';
  }

  getValidationErrorMessage(): string {
    let errorMessage = '';
    const validEmail = new RegExp('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$');
    const validNumber = new RegExp('^[0-9]{10}$');
    if (!this.messageData.name || !this.messageData.email || !this.messageData.phone || !this.messageData.message) {
      errorMessage = 'All fields are mandatory';
    } else if (!validEmail.test(this.messageData.email)) {
      errorMessage = 'email is invalid';
    } else if (!validNumber.test(this.messageData.phone)) {
      errorMessage = 'Mobile number must be 10 digits';
    }
    return errorMessage;
  }
}
