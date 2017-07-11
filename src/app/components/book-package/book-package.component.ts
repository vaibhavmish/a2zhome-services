import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PackageRequest, Address, PackageForm } from './../../models';
import { LoaderService, PackageService, AddressService, LocalStorageService } from './../../providers';
import { GLOBAL_CONSTANTS } from './../../global-constants';

enum STEP {
  PACKAGE_BOOKING,
  PACKAGE_BOOKED,
  SCHEDULE_VERIFICATION,
  SCHEDULE_VERIFICATION_SUBMITTED
};

enum NAV_MODE {
  PREV,
  NEXT
};

@Component({
  selector: 'app-book-package',
  templateUrl: './book-package.component.html',
  styleUrls: ['./book-package.component.css']
})

export class BookPackageComponent implements OnInit {
  showAddAddress = false;
  STEP: typeof STEP = STEP;
  NAV_MODE: typeof NAV_MODE = NAV_MODE;
  userId = '';
  step: STEP;
  pageTitle = '';
  stepTitle: string;
  navButtonText: string;
  BOOK_PACKAGE = 'BOOK PACKAGE';
  PROCEED_TO_VERIFICATION = 'PROCEED TO VERIFICATION';
  packageRequest: PackageRequest;
  showNavButtons = true;
  message = '';
  addressList: Array<Address>;
  showDatePicker: boolean;
  showTimePicker; boolean;
  scheduleDate = '';
  address = '';
  tpkTime: Date = new Date();
  tpkDate: Date = new Date();
  minDate: Date = new Date();
  minTime: Date = new Date();
  scheduleTime = '';
  bookPackageResponse: any;

  constructor(
    private router: Router,
    private packageService: PackageService,
    private addressService: AddressService,
    private localStorageService: LocalStorageService,
    private loaderService: LoaderService) { }


  ngOnInit() {
    this.bookPackageResponse = {
      booked_id: '',
      order_id: ''
    };
    this.userId = this.localStorageService.getItem(GLOBAL_CONSTANTS.LS_LOGIN_USER_DATA, '_id');
    this.step = STEP.PACKAGE_BOOKING;
    this.navButtonText = this.BOOK_PACKAGE;
    this.pageTitle = 'BOOK PACKAGE';
    this.showNavButtons = false;
    this.packageRequest = this.packageService.getSavedPackage();
    this.packageRequest.user_id = this.userId;
    const currDate = new Date();
    this.scheduleDate = currDate.toLocaleDateString();
    this.scheduleTime = currDate.toLocaleTimeString();
    if (this.userId !== '') {
      this.fetchAddress();
      this.bookPackage();
    }
  }

  navigateToPage(navMode: NAV_MODE) {
    if (this.step === STEP.PACKAGE_BOOKED) {
      if (navMode === NAV_MODE.PREV) {
      } else if (navMode === NAV_MODE.NEXT) {
        this.stepTitle = 'SCHEDULE VERIFICATION';
        this.step = STEP.SCHEDULE_VERIFICATION;
        this.navButtonText = 'SCHEDULE VERIFICATION';
      }
    } else if (this.step === STEP.SCHEDULE_VERIFICATION) {
      if (navMode === NAV_MODE.PREV) {

      } else if (navMode === NAV_MODE.NEXT) {
        this.schedulePackageVerification();
      }
    } else if (this.step === STEP.SCHEDULE_VERIFICATION_SUBMITTED) {
      if (navMode === NAV_MODE.PREV) {

      } else if (navMode === NAV_MODE.NEXT) {
        this.router.navigate(['/']);
      }
    }
  }

  goToPrev() {
    this.message = '';
    this.navigateToPage(NAV_MODE.PREV);
  }

  goToNext() {
    this.message = this.getErrorMessage();
    if (this.message === '') { // if no validation error, proceed
      this.navigateToPage(NAV_MODE.NEXT);
    }
  }

  getErrorMessage(): string {
    let errorMessage = '';
    if (this.step === STEP.SCHEDULE_VERIFICATION) {
      if (this.address === '') {
        errorMessage = 'Please Select Address';
      } else if (this.scheduleDate === '') {
        errorMessage = 'Please Select Schedule Date';
      } else if (this.scheduleTime === '') {
        errorMessage = 'Please Select Schedule Time';
      }
    }
    return errorMessage;
  }

  bookPackage() {
    this.packageService.bookPackage(this.packageRequest)
      .subscribe(res => {
        this.bookPackageResponse.order_id = res.order_id;
        this.bookPackageResponse.booked_id = res.booked_id;
        this.step = STEP.PACKAGE_BOOKED;
        this.navButtonText = this.PROCEED_TO_VERIFICATION;
        this.showNavButtons = true;
      });
  }

  schedulePackageVerification() {
    this.loaderService.display(true);
    const mobile = this.localStorageService.getItem(GLOBAL_CONSTANTS.LS_LOGIN_USER_DATA, 'mobile');
    this.packageService.scheduleVerifyPackage(this.bookPackageResponse.booked_id, this.scheduleDate, this.scheduleTime, this.address, mobile)
      .subscribe(res => {
        this.step = STEP.SCHEDULE_VERIFICATION_SUBMITTED;
        this.navButtonText = 'Home';
        this.loaderService.display(false);
      });
  }

  getSelectedServices() {
    let data = '';
    if (this.bookPackage) {
      data = this.packageRequest.services.reduce((result, service) => {
        return result + service + ',';
      }, '');
    }
    return data.length > 0 ? data.slice(0, data.length - 1) : data;
  }

  fetchAddress() {
    this.addressService.getAllAddress(this.userId)
      .then(res => this.addressList = res);
  }

  public onSelectionDone(a) {
    this.scheduleDate = a.toLocaleDateString();
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
    this.scheduleTime = this.tpkTime.toLocaleTimeString();
  }

  getCompleteAddress(addr: Address) {
    return this.addressService.getCompleteAddress(addr);
  }

  getAddressList(user_id: string) {
    this.addressService.getAllAddress(user_id)
      .then(res => {
        this.addressList = res;
        this.loaderService.display(false);
      });
  }

  showAddAddressModel() {
    this.showAddAddress = true;
  }

  hideAddAddress(e) {
    this.showAddAddress = false;
  }

  onSaveAddress() {
    this.getAddressList(this.userId);
    this.showAddAddress = false;
  }

}
