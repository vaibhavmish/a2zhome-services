import { RescheduleBookingRequest } from './../models/booking.model';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { BaseService } from './base.service';

import { Service } from '../models/service.model';
import { BookingRequest, BookingOrdersResponse, Personal, Schedule } from '../models/booking.model';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { GLOBAL_CONSTANTS } from '../global-constants';

@Injectable()
export class BookingService extends BaseService {
  bookingUrl: string;
  private BookingRequest: BookingRequest = new BookingRequest();
  private isPersonalFormValid: boolean;
  private isSchduleFormValid: boolean;
  private isServiceSelected: boolean;
  private _serviceList: Service[];

  constructor(private http: Http) {
    super();
    this.bookingUrl = GLOBAL_CONSTANTS.BASE_API_URL + '/book/service';
  }

  bookService(req: BookingRequest): Observable<string> {
    const bodyString = JSON.stringify(req);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });

    return this.http.post(this.bookingUrl, bodyString, options)
      .map(res => {
        const result = res.json();
        if (result && result.message) {
          return result.message;
        }
      })
      .catch((error: any) => Observable.throw(error.json().error || 'Server Error'));
  }

  bookServices(req: BookingRequest[]): Observable<string[]> {
    const bodyString = JSON.stringify(req);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });

    return this.http.post(`${GLOBAL_CONSTANTS.BASE_API_URL}/book/services`, bodyString, options)
      .map(res => {
        const result = res.json();
        if (result && result.message) {
          return result.message;
        }
      })
      .catch((error: any) => Observable.throw(error.json().error || 'Server Error'));
  }

  reScheduleBookingOrder(req: RescheduleBookingRequest): Observable<string> {
    const bodyString = JSON.stringify(req);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });

    return this.http.post(`${GLOBAL_CONSTANTS.BASE_API_URL}/update/order`, bodyString, options)
      .map(res => {
        const result = res.json();
        if (result && result.message) {
          return result.message;
        }
      })
      .catch((error: any) => Observable.throw(error.json().error || 'Server Error'));
  }

  cancelBookingOrder(orderID: string): Observable<string> {
    const req = {
      order_id: orderID,
      status: 'CANCELLED'
    };
    const bodyString = JSON.stringify(req);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });

    return this.http.post(`${GLOBAL_CONSTANTS.BASE_API_URL}/order/status`, bodyString, options)
      .map(res => {
        const result = res.json();
        if (result && result.message) {
          return result.message;
        }
      })
      .catch((error: any) => Observable.throw(error.json().error || 'Server Error'));
  }

  getBookingOrders(userId: string): Observable<BookingOrdersResponse[]> {
    return this.http.get(`${GLOBAL_CONSTANTS.BASE_API_URL}/bookings?user_id=${userId}`)
      .map(res => {
        const response = res.json();
        let BookingOrdersResponse: BookingOrdersResponse[];
        BookingOrdersResponse = response;
        return BookingOrdersResponse.reverse();
      })
      .catch(err => super.handleError(err));
  }

  getBookingOrdersByStatus(userId: string, status: string): Observable<BookingOrdersResponse[]> {
    return this.http.get(`${GLOBAL_CONSTANTS.BASE_API_URL}/bookings?user_id=${userId}`)
      .map(res => {
        const response = res.json();
        let BookingOrdersResponse: BookingOrdersResponse[];
        BookingOrdersResponse = response;
        const data = BookingOrdersResponse.reverse();
        return data.filter(item => item.status.toLowerCase() === status.toLowerCase());
      })
      .catch(err => super.handleError(err));
  }

  getServiceList(): Service[] {
    return this._serviceList;
  }


  setServiceList(serviceList: Service[]): void {
    this._serviceList = serviceList;
  }

  getPersonal(): Personal {
    const personal: Personal = {
      user_id: '',
      fullName: '',
      email: '',
      location: '',
      phone: '',
      address: this.BookingRequest.address
    };
    return personal;
  }

  setPersonal(data: Personal) {
    this.isPersonalFormValid = true;
    this.BookingRequest.address = data.address;
    this.BookingRequest.number = data.phone;
    this.BookingRequest.user_id = data.user_id;
  }

  getSchedule(): Schedule {
    const schedule: Schedule = {
      scheduleDate: this.BookingRequest.scheduled_date,
      scheduleTime: this.BookingRequest.scheduled_time
    };
    return schedule;
  }

  setSchedule(data: Schedule) {
    this.isSchduleFormValid = true;
    this.BookingRequest.scheduled_date = data.scheduleDate;
    this.BookingRequest.scheduled_time = data.scheduleTime;
  }

  getFormData(): BookingRequest {
    return this.BookingRequest;
  }

  isFormValid() {
    // Return true if all forms had been validated successfully; otherwise, return false
    return this.isServiceSelected && this.isPersonalFormValid &&
      this.isSchduleFormValid;
  }

}
