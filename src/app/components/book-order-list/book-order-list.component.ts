import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';

import { ModalService, IModalContent } from '../../core/modal/modal.service';
import { Modal2Component } from './../../core/modal2/modal2.component';

import {
  BookingService,
  LocalStorageService,
  LoaderService,
  PagerService
} from '../../providers';
import {
  Schedule,
  BookingOrdersResponse,
  RescheduleBookingRequest
} from '../../models';
import { GLOBAL_CONSTANTS } from '../../global-constants';

@Component({
  selector: 'app-book-order-list',
  templateUrl: './book-order-list.component.html',
  styleUrls: ['./book-order-list.component.scss']
})
export class BookOrderListComponent implements OnInit {
  bookOrderList1: BookingOrdersResponse[];
  bookOrderList: BookingOrdersResponse[];
  pager: any = {};
  currentPage: number;
  pagedItems: BookingOrdersResponse[];
  showRescheduleForm;
  boolean;
  showOrderDetailModal = false;
  showDatePicker: boolean;
  showTimePicker: boolean;
  public schDate: Date;
  public schTime: Date = new Date();
  minDate: Date = new Date();
  minTime: Date = new Date();
  schedule: Schedule;
  serviceName: string;
  selectedBookingOrder: BookingOrdersResponse;
  message: string;
  alertType: string;
  selectedTab: string;
  orderCancellationForm: FormGroup;
  _serviceName: FormControl;
  _reason: FormControl;
  @ViewChild('reScheduleOrderModal')
  public reScheduleOrderModal: Modal2Component;
  @ViewChild('orderCancellationModal')
  public orderCancellationModal: Modal2Component;
  @ViewChild('viewOrderDetailsModal')
  public viewOrderDetailsModal: Modal2Component;

  constructor(
    private bookingService: BookingService,
    private pagerService: PagerService,
    private modalService: ModalService,
    private loaderService: LoaderService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.selectedTab = '1';

    this.createFormControls();
    this.createForm();

    this.fetchData(1, 'upcoming');
    this.schedule = new Schedule();
  }

  createFormControls() {
    this._serviceName = new FormControl('', Validators.required);
    this._reason = new FormControl('', Validators.required);
  }

  createForm() {
    this.orderCancellationForm = new FormGroup({
      _serviceName: this._serviceName,
      _reason: this._reason
    });
  }

  fetchData(page: number, filter: string) {
    this.bookOrderList1 = null;
    const _id = this.localStorageService.getItem(
      GLOBAL_CONSTANTS.LS_LOGIN_USER_DATA,
      '_id'
    );
    this.bookingService.getBookingOrders(_id).subscribe(res => {
      this.bookOrderList1 = res;
      this.filterData(filter);
      this.setPage(page);
    });
  }

  selectTab(filter: string) {
    this.selectedTab = filter === 'upcoming' ? '1' : '2';
    this.filterData(filter);
    this.setPage(1);
  }

  filterData(filter: string) {
    if (filter === 'upcoming') {
      this.bookOrderList = this.bookOrderList1.filter(
        data => data.status.toLowerCase() === 'booked'
      );
    } else {
      this.bookOrderList = this.bookOrderList1.filter(
        data => data.status.toLowerCase() === 'cancelled'
      );
    }
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.message = '';
    this.currentPage = page;
    this.pager = this.pagerService.getPager(this.bookOrderList.length, page, 5);

    this.pagedItems = this.bookOrderList.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
  }

  viewDetails(bookingOrder: BookingOrdersResponse) {
    this.selectedBookingOrder = bookingOrder;
    this.showOrderDetailModal = true;
  }

  showRescheduleBookingOrderForm(bookingOrder: BookingOrdersResponse) {
    this.showDatePicker = false;
    this.showTimePicker = false;
    this.reScheduleOrderModal.show();
    this.selectedBookingOrder = bookingOrder;
    this.serviceName = bookingOrder.service_name;
    this.schedule.scheduleDate = bookingOrder.scheduled_date;
    this.schedule.scheduleTime = bookingOrder.scheduled_time;
  }

  reScheduleOrder() {
    const req = new RescheduleBookingRequest();
    req.order_id = this.selectedBookingOrder._id;
    req.scheduled_date = this.schedule.scheduleDate;
    req.scheduled_time = this.schedule.scheduleTime;
    this.loaderService.display(true);
    this.bookingService.reScheduleBookingOrder(req).subscribe(res => {
      if (res && res.indexOf('not found') > -1) {
        this.alertType = 'message-text';
      } else {
        this.alertType = 'success-text';
      }
      this.message = `Order ID: ${this.selectedBookingOrder.order_id} ${res}`;
      this.reScheduleOrderModal.hide();
      this.updateGrid();
      this.loaderService.display(false);
    });
  }

  updateGrid() {
    this.bookOrderList.map(order => {
      if (order._id === this.selectedBookingOrder._id) {
        order.scheduled_date = this.schedule.scheduleDate;
        order.scheduled_time = this.schedule.scheduleTime;
      }
    });
  }
  showCancelBookingOrder(bookingOrder: BookingOrdersResponse) {
    this.selectedBookingOrder = bookingOrder;
    this.orderCancellationForm.reset();
    this.serviceName = bookingOrder.service_name;
    this._serviceName.setValue(this.selectedBookingOrder.service_name);
    this.orderCancellationModal.show();
  }

  cancelBookingOrder() {
    if (this.orderCancellationForm.valid) {
      this.bookingService
        .cancelBookingOrder(this.selectedBookingOrder._id)
        .subscribe(
          res => {
            if (res === 'not found') {
              this.alertType = 'message-text';
            } else {
              this.alertType = 'success-text';
            }
            this.message = `Order ID ${this.selectedBookingOrder
              .order_id} ${res}`;
            this.bookOrderList.map(order => {
              if (order._id === this.selectedBookingOrder._id) {
                order.status = 'CANCELLED';
              }
            });
            this.filterData('upcoming');
            this.setPage(this.currentPage);
            this.orderCancellationModal.hide();
            this.orderCancellationForm.reset();
          },
          err => {
            this.orderCancellationModal.hide();
          }
        );
    } else {
      this._reason.markAsDirty();
    }
  }

  toggleshowDatePicker() {
    if (this.showTimePicker) {
      this.showTimePicker = false;
    }
    this.showDatePicker = !this.showDatePicker;
    this.schedule.scheduleTime = this.schTime.toLocaleTimeString();
  }

  toggleshowTimePicker() {
    if (this.showDatePicker) {
      this.showDatePicker = false;
    }
    this.showTimePicker = !this.showTimePicker;
    this.schedule.scheduleTime = this.schTime.toLocaleTimeString();
  }

  public onSelectionDone(selDate) {
    this.showDatePicker = false;
    this.schedule.scheduleDate = this.formatDate(selDate);
    if (this.isTodayDate(selDate)) {
      this.minTime = new Date();
    } else {
      this.minTime = new Date('01/01/1900');
    }
  }

  formatDate(inputDate) {
    return new Date(inputDate)
      .toString()
      .replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/, '$2-$1-$3');
  }

  isTodayDate(inputDate: string): boolean {
    const date1 = new Date(inputDate);
    const date2 = new Date();
    return (
      date1.getDay() === date2.getDay() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  hideScheduleModal() {
    this.reScheduleOrderModal.hide();
  }
}
