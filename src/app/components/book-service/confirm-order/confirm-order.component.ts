import { MobileAppComponent } from './../../mobile-app/mobile-app.component';
import { PageNotFoundComponent } from './../../page-not-found/page-not-found.component';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BookingRequest } from '../../../models';
import { ModalService, IModalContent } from '../../../core/modal/modal.service';
import {
  BookingService,
  HandyService,
  LocalStorageService,
  LoaderService
} from '../../../providers';
import { GLOBAL_CONSTANTS } from '../../../global-constants';

@Component({
  selector: 'app-confirm-order-comp',
  templateUrl: './confirm-order.component.html',
  styleUrls: ['./confirm-order.component.scss']
})
export class ConfirmOrderComponent implements OnInit {
  title = 'Please review the information before submitting.';
  bookingDone: boolean;
  orderIdList: Array<string>;
  userName: string;
  location: string;
  formData: BookingRequest;
  isFormValid: boolean;
  service_id: string;
  serviceName: string;
  errorMessage: string;
  successMessage: string;
  bookingOrders = [];

  constructor(
    private bookingService: BookingService,
    private localStorageService: LocalStorageService,
    private handyService: HandyService,
    private loaderservice: LoaderService,
    private modalService: ModalService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.service_id = params['service_id'] || ''; // (+) converts string 'id' to a number
      const serviceList = this.bookingService.getServiceList();
      if (serviceList) {
        const total = serviceList.filter(item => item.selected === true).length;
        // if no service selected, redirect to service-selection Page
        if (total === 0) {
          this.router.navigate(['/booking/service-selection']);
        }
        const services = serviceList
          .filter(item => item.selected === true)
          .reduce(function(a, b) {
            return a + b.name + ', ';
          }, '');
        if (services && services.length > 0) {
          this.serviceName = `${services.substring(0, services.length - 2)}`;
        }
      }
    });

    this.formData = this.bookingService.getFormData();
    this.isFormValid = this.bookingService.isFormValid();
    this.userName = this.localStorageService.getItem(
      GLOBAL_CONSTANTS.LS_LOGIN_USER_DATA,
      'name'
    );
    this.formData.location = this.localStorageService.getItem(
      GLOBAL_CONSTANTS.LS_CITY
    );
  }

  retrieveServiceName(service_id) {
    this.handyService
      .getServiceName(service_id)
      .then(res => (this.formData.service_name = res));
  }

  gotoSchedule() {
    if (this.service_id === '') {
      this.router.navigate(['booking/schedule']);
    } else {
      this.router.navigate(['booking/schedule'], {
        queryParams: { service_id: this.service_id }
      });
    }
  }

  submit() {
    if (!this.bookingService.isFormValid) {
      return;
    }
    const req = this.buildFormData();
    this.formData.service_id = this.service_id;
    const modalContent: IModalContent = {
      header: 'Booking Service',
      body: 'Are you sure want to submit?',
      cancelButtonText: 'No',
      OKButtonText: 'Yes'
    };
    console.log('req', req);
    this.modalService.show(modalContent).then(result => {
      if (result === true) {
        this.loaderservice.display(true);
        this.bookingService.bookServices(req).subscribe(
          res => {
            if (res) {
              this.bookingDone = true;
              this.successMessage = `Your Order is confirmed.`;
              this.orderIdList = res;
              this.buildbookingOrdersModel(res);
              console.log('this.bookingOrders', this.bookingOrders);
            }
            this.loaderservice.display(false);
          },
          err => {
            this.errorMessage = err;
            this.loaderservice.display(false);
          }
        );
      }
    });
  }

  buildbookingOrdersModel(data: string[]) {
    if (data) {
      data.map(item => {
        const filterService = this.bookingService
          .getServiceList()
          .filter(service => item.indexOf(service.service_code) > -1);
        if (filterService.length > 0) {
          this.bookingOrders.push({
            service_name: filterService[0].name,
            order_id: item
          });
        }
      });
    }
  }

  buildFormData(): BookingRequest[] {
    const bookingReq = new Array<BookingRequest>();
    this.bookingService.getServiceList().map(item => {
      if (item.selected) {
        const req = new BookingRequest();
        req.user_id = this.formData.user_id;
        req.location = this.formData.location;
        req.address = this.formData.address;
        req.number = this.formData.number;
        req.scheduled_date = this.formData.scheduled_date;
        req.scheduled_time = this.formData.scheduled_time;
        req.service_id = item._id;
        req.service_name = item.name;
        bookingReq.push(req);
      }
    });
    return bookingReq;
  }
}
