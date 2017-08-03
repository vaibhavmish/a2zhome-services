import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Personal, BookingRequest, Address } from '../../../models';

import { BookingService, LocalStorageService, LoaderService, AddressService } from '../../../providers';

import { GLOBAL_CONSTANTS } from '../../../global-constants';

@Component({
  selector: 'app-comp-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {
  personal: Personal = new Personal();
  form: any;
  addressList: Address[];
  private service_id: string;
  showAddAddress: boolean;

  constructor(
    private bookingService: BookingService,
    private loaderService: LoaderService,
    private addressService: AddressService,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    // this.loaderService.display(true);
    this.personal = this.bookingService.getPersonal();
    this.route.queryParams.subscribe(params => {
      this.service_id = params['service_id'] || ''; // (+) converts string 'id' to a number
    });

    this.personal.fullName = this.localStorageService.getItem(GLOBAL_CONSTANTS.LS_LOGIN_USER_DATA, 'name');
    this.personal.phone = this.localStorageService.getItem(GLOBAL_CONSTANTS.LS_MOBILE);
    this.personal.email = this.localStorageService.getItem(GLOBAL_CONSTANTS.LS_LOGIN_USER_DATA, 'email');
    this.personal.user_id = this.localStorageService.getItem(GLOBAL_CONSTANTS.LS_LOGIN_USER_DATA, '_id');
    this.personal.location = this.localStorageService.getItem(GLOBAL_CONSTANTS.LS_CITY);
    if (this.personal.user_id) {
      this.getAddressList(this.personal.user_id);
    }
  }

  getAddressList(user_id: string) {
    // this.loaderService.display(true);
    this.addressService.getAllAddress(user_id)
      .then(res => {
        this.addressList = res;
        // this.loaderService.display(false);
      },
      err => {
        // this.loaderService.display(false);
      });
  }

  getCompleteAddress(address: any) {
    return this.addressService.getCompleteAddress(address);
  }

  showAddAddressModel() {
    this.showAddAddress = true;
  }

  hideAddAddress(e) {
    this.showAddAddress = false;
  }

  onSaveAddress() {
    this.getAddressList(this.personal.user_id);
    this.showAddAddress = false;
  }

  save(form: any) {
    if (form.valid) {
      this.bookingService.setPersonal(this.personal);
      if (this.service_id === '') {
        this.router.navigate(['booking/schedule']);
      } else {
        this.router.navigate(['booking/schedule'], { queryParams: { service_id: this.service_id } });
      }

    }
  }

  gotoService() {
    if (this.service_id === '') {
      this.router.navigate(['booking/service-selection']);
    } else {
      this.router.navigate(['booking/service-selection'], { queryParams: { service_id: this.service_id } });
    }

  }

}