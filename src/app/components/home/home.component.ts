import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { Logger } from '../../logger/default-log.service';
import { GLOBAL_CONSTANTS } from '../../global-constants';
import { LocationService, ReviewService, HandyService, BroadcastService, BookingService, LocalStorageService } from '../../providers';
import { Location, Service, BookingOrdersResponse, ReviewReq } from '../../models';

@Component({
  selector: 'app-comp-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  city: string;
  serviceData: Array<Service>;
  @ViewChild('ReviewModal') public reviewModal: ModalDirective;
  showReviewModal = false;
  maxRate = 5;
  customerCareExecRating = '0';
  servicemanRating = '0';
  serviceAuditRating = '0';
  comment = '';
  reviewCompleted = false;
  order_id = '';
  order_amt = '';
  errorReviewMessage = '';
  btnSubmitReview = 'SUBMIT';
  user_id = '';
  userOrderList: BookingOrdersResponse[];

  constructor(private locationService: LocationService,
    private service: HandyService,
    private router: Router,
    private logger: Logger,
    private bookingService: BookingService,
    private reviewService: ReviewService,
    private localStorageService: LocalStorageService,
    private broadcastService: BroadcastService
  ) {
  }

  ngOnInit() {
    this.broadcastService.on(GLOBAL_CONSTANTS.BROADCAST_CITY)
      .subscribe(data => {
        const selCity = JSON.parse(JSON.stringify(data));
        this.city = selCity;
        this.logger.info(`subscribe for city:${selCity}`);
        this.fetchServiceData(selCity);
      });
    const city = localStorage.getItem(GLOBAL_CONSTANTS.LS_CITY);
    if (city) {
      this.fetchServiceData(city);
    }
    this.user_id = this.localStorageService.getItem(GLOBAL_CONSTANTS.LS_LOGIN_USER_DATA, '_id');
    if (this.user_id) {
      this.fetchUserBookingOrders(this.user_id);
    }
  }

  private fetchServiceData(city: string) {
    if (city && city.length > 0) {
      this.service.getServicesByCity(city)
        .subscribe(res => {
          this.serviceData = res.slice(0, 6);
        });
    } else {
      this.service.getServices()
        .subscribe(res => {
          this.serviceData = res.slice(0, 6);
        });
    }
  }

  fetchUserBookingOrders(user_id) {
    this.bookingService.getBookingOrdersByStatus(user_id, 'completed')
      .subscribe(res => {
        this.userOrderList = res.filter(item => item.reviewed !== true);
         this.logger.info('completed orders:', this.userOrderList);
        if (this.userOrderList && this.userOrderList.length > 0) {
          this.order_id = this.userOrderList[0].order_id;
          this.order_amt = this.getTotalOrderAmt(this.userOrderList[0]);
          this.showReviewModal = true;
        }
      });
  }

  getTotalOrderAmt(order: BookingOrdersResponse): string {
    let amt = 0;
    order.cost.map(item => {
      if (item.amount) {
        amt += item.amount;
      }
    });
    return amt > 0 ? amt.toString() : '5000';
  }

  getReviewvalidationErrorMessage() {
    let message = '';
    const overallRating = this.getOverAllRating();
    if (this.customerCareExecRating === '0' || this.servicemanRating === '0' || this.serviceAuditRating === '0') {
      message = 'Rating are mandatory';
    } else if (overallRating < 3.5 && this.comment === '') {
      message = 'Comment is mandatory';
    }
    return message;
  }

  getOverAllRating() {
    const tot = (parseFloat(this.customerCareExecRating) + parseFloat(this.servicemanRating) + parseFloat(this.serviceAuditRating) / 3);
    return tot;
  }

  submitReview(value, valid): void {
    this.errorReviewMessage = this.getReviewvalidationErrorMessage();
    if (this.errorReviewMessage === '') {
      this.btnSubmitReview = 'Please wait..';
      const overallRating = this.getOverAllRating();
      const reviewReq = new ReviewReq();
      reviewReq.cus_id = this.user_id;
      reviewReq.service_id = this.userOrderList[0].service_id;
      reviewReq.order_id = this.userOrderList[0]._id;
      reviewReq.executive_rating = this.customerCareExecRating.toString();
      reviewReq.serviceman_rating = this.servicemanRating.toString();
      reviewReq.quality_rating = this.serviceAuditRating.toString();
      reviewReq.overall_rating = overallRating.toString();
      reviewReq.comment = this.comment;
      this.reviewService.addReview(reviewReq)
        .subscribe(res => {
          this.reviewCompleted = true;
        },
        err => {
        });
    }
  }

  becomePartner() {
    this.router.navigate(['/package-form'], { queryParams: { 'form-type': '3' } });
  }
  maintenancePackage() {
    this.router.navigate(['/maintenance-package']);
  }

  onExcutiveRatingChange(val) {
    this.customerCareExecRating = val;
    this.errorReviewMessage = this.getReviewvalidationErrorMessage();
  }

  onServicemanRatingChange(val) {
    this.servicemanRating = val;
    this.errorReviewMessage = this.getReviewvalidationErrorMessage();
  }

  onserviceAuditRatingChange(val) {
    this.serviceAuditRating = val;
    this.errorReviewMessage = this.getReviewvalidationErrorMessage();
  }
}
