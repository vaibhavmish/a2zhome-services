import { Component, OnInit } from '@angular/core';

import { Package } from '../../models';
import { PackageService, LocalStorageService, LoaderService } from '../../providers';
import { GLOBAL_CONSTANTS } from './../../global-constants';

enum STEP {
  SHOW_PACKAGES,
  FREE_SERVICE_BOOK,
  FREE_SERVICE_BOOKING_DONE
};

@Component({
  selector: 'app-user-packages',
  templateUrl: './user-packages.component.html',
  styleUrls: ['./user-packages.component.css']
})

export class UserPackagesComponent implements OnInit {
  STEP: typeof STEP = STEP;
  step: STEP;
  user_id: string;
  pageTitle: string;
  userPackageList: Package[];
  name: string;
  email: string;
  mobile: string;
  address: string;
  specialReq: string;
  schDate: string;
  schTime: string;
  tpkTime: Date = new Date();
  tpkDate: Date = new Date();
  minDate: Date = new Date();
  showDatePicker: boolean;
  showTimePicker: boolean;

  chkCarpentry: boolean;
  chkElectrical: boolean;
  chkPlumbing: boolean;
  chkACService: boolean;

  serviceTypes: Array<any> = ['Carpenter', 'Plumbing Services', 'Electrical Service', 'AC Service'];
  packageID: string;
  errorMsg: string;
  order_id= '';

  constructor(
    private packageService: PackageService,
    private loaderService: LoaderService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    this.pageTitle = 'SCHEDULE FREE SERVICE';
    this.step = STEP.SHOW_PACKAGES;
    this.user_id = this.localStorageService.getItem(GLOBAL_CONSTANTS.LS_LOGIN_USER_DATA, '_id');
    this.name = this.localStorageService.getItem(GLOBAL_CONSTANTS.LS_LOGGEDINUSERNAME);
    this.email = this.localStorageService.getItem(GLOBAL_CONSTANTS.LS_LOGIN_USER_DATA, 'email');
    this.mobile = this.localStorageService.getItem(GLOBAL_CONSTANTS.LS_LOGIN_USER_DATA, 'mobile');

    this.chkACService = false;
    this.chkCarpentry = false;
    this.chkElectrical = false;
    this.chkPlumbing = false;

    const currDate = new Date();
    this.schDate = currDate.toLocaleDateString();
    this.schTime = currDate.toLocaleTimeString();

    this.packageService.getUserPackages(this.user_id)
      .subscribe(
      res => {
        this.userPackageList = res;
      }
      );
  }

  public onSelectionDone(a) {
    this.schDate = a.toLocaleDateString();
    this.showDatePicker = false;
  }

  toggleShowDatePicker() {
    this.showDatePicker = !this.showDatePicker;
    return this.showDatePicker;
  }

  toggleShowTimePicker() {
    this.showTimePicker = !this.showTimePicker;
    return this.showTimePicker;
  }

  syncTime() {
    this.schTime = this.tpkTime.toLocaleTimeString();
  }

  isServiceExistInPackage(service: string): boolean {
    let result = false;
    const packageData = this.userPackageList.filter(res => res._id === this.packageID);
    if (packageData && packageData.length > 0) {
      packageData[0].services.map(item => {
        if (item.toLowerCase().indexOf(service.toLowerCase()) > -1) {
          result = true;
          return result;
        }
      });
    }
    return result;
  }

  getServiceSelectedCount(): number {
    let count = 0;
    if (this.chkACService) {
      count++;
    }
    if (this.chkCarpentry) {
      count++;
    }
    if (this.chkElectrical) {
      count++;
    }
    if (this.chkPlumbing) {
      count++;
    }
    return count;
  }

  getServiceSelected(): Array<string> {
    const serviceSel = [];
    if (this.chkACService) {
      serviceSel.push(this.serviceTypes[3]);
    }
    if (this.chkCarpentry) {
      serviceSel.push(this.serviceTypes[0]);
    }
    if (this.chkElectrical) {
      serviceSel.push(this.serviceTypes[2]);
    }
    if (this.chkPlumbing) {
      serviceSel.push(this.serviceTypes[1]);
    }
    return serviceSel;
  }

  getErrorMessage(): string {
    let errorMessage = '';
    if (this.name === '') {
      errorMessage = 'Name is required';
    } else if (this.email === '') {
      errorMessage = 'Email is required';
    } else if (this.mobile === '') {
      errorMessage = 'Mobile Number is required';
    } else if (this.schDate === '') {
      errorMessage = 'Schedule Date is required';
    } else if (this.schTime === '') {
      errorMessage = 'Schedule Time is required';
    } else if (this.getServiceSelectedCount() === 0) {
      errorMessage = 'Please select atleast one service';
    }
    return errorMessage;
  }

  goToBack() {
    this.step = STEP.SHOW_PACKAGES;
  }

  bookFreeService(packageID: string) {
    this.packageID = packageID;
    const packageData = this.userPackageList.filter(res => res._id === packageID);
    if (packageData && packageData.length > 0) {
      this.address = packageData[0].verification_address;
      this.step = STEP.FREE_SERVICE_BOOK;
    }
  }

  scheduleFreeService() {
    this.errorMsg = this.getErrorMessage();
    if (this.errorMsg === '') {
      this.loaderService.display(true);
      this.packageService.bookServiceWithPackage(this.user_id, this.packageID, this.getServiceSelected(), this.schDate, this.schTime, this.address, this.mobile)
        .subscribe(res => {
          this.order_id = res;
          this.step = STEP.FREE_SERVICE_BOOKING_DONE;
          this.loaderService.display(false);
        },
        err => {
          this.loaderService.display(false);
        });
    }
  }

}
