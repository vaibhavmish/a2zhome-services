import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { ModalService, IModalContent } from '../../core/modal/modal.service';
import { LoaderService, LocationService, BookingService, AuthService, LocalStorageService, GeoLocationService, BroadcastService, ReviewService } from '../../providers';
import { Location, ReviewReq, Review, BookingOrdersResponse } from '../../models';

import { Subscription } from 'rxjs/Subscription';
import { GLOBAL_CONSTANTS } from '../../global-constants';

@Component({
  selector: 'app-comp-navbar-top',
  templateUrl: './navbar-top.component.html',
  styleUrls: ['./navbar-top.component.scss']
})
export class NavbarTopComponent implements OnInit, OnDestroy {
  locationData: Location[];
  city: string = GLOBAL_CONSTANTS.SELECT_CITY;
  citySelected: string = GLOBAL_CONSTANTS.SELECT_CITY;
  isCityModalShown: boolean;
  isLoggedIn: boolean;
  loginUser: string;
  subscription: Subscription;
  subscription2: Subscription;
  errorMessage = '';

  @ViewChild('cityModal') public cityModal: ModalDirective;

  get locationList(): {}[] { return this.locationData; }

  constructor(
    private locationSerice: LocationService,
    private authService: AuthService,
    private bookingService: BookingService,
    private broadcastService: BroadcastService,
    private localtStorageService: LocalStorageService,
    private geoLocationService: GeoLocationService,
    private loaderService: LoaderService,
    private modalService: ModalService,
    private reviewService: ReviewService,
    private router: Router
  ) { }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private init() {
    this.fetchLocationList();
    if (localStorage.getItem(GLOBAL_CONSTANTS.LS_CITY)) {
      this.city = localStorage.getItem(GLOBAL_CONSTANTS.LS_CITY);
    }
    this.subscription = this.broadcastService.on(GLOBAL_CONSTANTS.BROASCAST_ISLOGGEDIN)
      .subscribe(data => {
        const result = JSON.parse(JSON.stringify(data));
        this.isLoggedIn = result;
        this.setUserName();
      });

    // this.geoLocationService.getCityData();
    // this.subscription2 = this.broadcastService.on(GLOBAL_CONSTANTS.BROADCAST_CITY)
    //   .subscribe(data => {
    //     const result = JSON.parse(JSON.stringify(data));
    //     if (this.isCityExists(result)) {
    //       this.city = result;
    //       this.localtStorageService.setItem(GLOBAL_CONSTANTS.LS_CITY, result);
    //     } else {
    //       this.isCityModalShown = true;
    //     }
    //   });
    this.isLoggedIn = this.authService.isAuthenticated();
    this.setUserName();
  }

  fetchLocationList = () => {
    this.locationSerice.getLocations()
      .subscribe(res => {
        this.locationData = res;
        const loc = new Location();
        loc._id = '-1';
        loc.city_name = GLOBAL_CONSTANTS.SELECT_CITY;
        this.locationData.unshift(loc);
        this.checkIfCityIsFound();
      });
  }

  checkIfCityIsFound() {
    // check if location exists in local storage
    const localCity = localStorage.getItem(GLOBAL_CONSTANTS.LS_CITY);
    if ([null, undefined, ''].indexOf(localCity, 0) !== -1) {// if not ,get it from api-geo-location.serrvice
      this.geoLocationService.getCity()
        .subscribe(res => {
          if (this.isCityExists(res)) {
            this.city = res;
            this.localtStorageService.setItem(GLOBAL_CONSTANTS.LS_CITY, res);
          } else {
            this.isCityModalShown = true;
          }
        });
    } else {
      // do something when you already have the location
    }
  }

  isCityExists = (city: string) => {
    const filterData = this.locationData.filter(item => item.city_name.toLowerCase() === city.toLowerCase());
    return filterData.length > 0;
  }

  setUserName() {
    this.loginUser = this.localtStorageService.getItem(GLOBAL_CONSTANTS.LS_LOGGEDINUSERNAME);
  }

  showCityModal() {
    this.citySelected = this.city;
    this.isCityModalShown = true;
  }

  hideCityModal() {
    this.cityModal.hide();
  }

  onHidden() {
    this.isCityModalShown = false;
  }
  submitCity(f: any) {
    if (f.city !== 'select city') {
      this.city = f.city;
      this.localtStorageService.setItem(GLOBAL_CONSTANTS.LS_CITY, f.city);
      this.broadcastService.broadcast(GLOBAL_CONSTANTS.BROADCAST_CITY, f.city);
      this.cityModal.hide();
    }
  }

  myBookingOrders() {
    this.router.navigate(['book-order-list']);
  }

  logoutUser() {
    const modalContent: IModalContent = {
      header: 'Logout?',
      body: 'Are you sure want to logout?',
      cancelButtonText: 'No',
      OKButtonText: 'Yes'
    };
    this.modalService.show(modalContent)
      .then(result => {
        if (result === true) {
          localStorage.removeItem(GLOBAL_CONSTANTS.LS_LOGIN_USER_DATA);
          localStorage.removeItem(GLOBAL_CONSTANTS.LS_IS_LOGGED_IN);
          localStorage.removeItem(GLOBAL_CONSTANTS.LS_LOGGEDINUSERNAME);
          this.isLoggedIn = false;
          this.router.navigate(['signin']);
        }
      });
  }

}
