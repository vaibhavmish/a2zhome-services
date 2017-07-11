import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Address, Location } from '../../models';
import { AddressService, LocalStorageService, LoaderService, LocationService } from '../../providers';
import { GLOBAL_CONSTANTS } from '../../global-constants';

@Component({
  selector: 'app-comp-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {
  address: Address = new Address();
  locationData: Location[];
  @Output() onButtonClose: EventEmitter<boolean> = new EventEmitter();
  @Output() onButtonSave: EventEmitter<boolean> = new EventEmitter();
  successMessage: string;
  errorMessage: string;

  constructor(private addressService: AddressService,
    private loaderService: LoaderService,
    private locationService: LocationService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    this.address.id = this.localStorageService.getItem(GLOBAL_CONSTANTS.LS_LOGIN_USER_DATA, '_id');
    this.address.city = this.localStorageService.getItem(GLOBAL_CONSTANTS.LS_CITY);

    this.fetchCityList();
  }
  fetchCityList(): void {
    this.locationService.getLocations()
      .subscribe(res => {
        this.locationData = res;
        this.address.state = this.getState(this.address.city);
      });
  }

  handleClose() {
    this.onButtonClose.emit(true);
  }

  saveAddress(model: Address, isValid: boolean, f: any) {
    if (isValid) {
      this.loaderService.display(true);
      this.addressService.addAddress(model)
        .subscribe(res => {
          if (res === 'saved') {
            this.successMessage = 'Address saved successfully!!';
          } else {
            this.successMessage = res;
          }
          this.resetForm();
          this.loaderService.display(false);
          this.onButtonSave.emit(true);
        },
        err => {
          this.errorMessage = err;
          this.loaderService.display(false);
        });
    }
  }

  resetForm() {
    this.address = new Address();
  }

  getState(city: string): string {
    const selLocation = this.locationData.filter(loc => loc.city_name === city);
    return selLocation[0].state_name;
  }

  onCityChange(val) {
    this.address.state = this.getState(val);
  }
}