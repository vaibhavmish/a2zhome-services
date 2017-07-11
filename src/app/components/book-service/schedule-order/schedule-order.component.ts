import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Schedule, BookingRequest } from '../../../models';

import { BookingService, LocalStorageService } from '../../../providers';

@Component({
  selector: 'app-schedule-order',
  templateUrl: './schedule-order.component.html',
  styleUrls: ['./schedule-order.component.scss']
})
export class ScheduleOrderComponent implements OnInit {
  title = 'Schedule';
  showDatePicker: boolean;
  showTimePicker: boolean;
  public dd: Date = new Date();
  public tt: Date = new Date();
  minDate: Date = new Date();
  minTime: Date = new Date();
  schedule: Schedule;
  form: any;
  service_id: string;

  constructor(
    private bookingService: BookingService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.service_id = params['service_id'] || ''; // (+) converts string 'id' to a number
    });
    this.schedule = this.bookingService.getSchedule();
    if (!this.schedule.scheduleDate) {
      const currDate = new Date();
      this.schedule.scheduleDate = currDate.toLocaleDateString();
      this.schedule.scheduleTime = currDate.toLocaleTimeString();
    } else {
      this.bookingService.setSchedule(this.schedule);
    }
  }

  toggleshowDatePicker() {
    if (this.showTimePicker) {
      this.showTimePicker = false;
    }
    this.showDatePicker = !this.showDatePicker;
    this.schedule.scheduleTime = this.tt.toLocaleTimeString();
    return this.showDatePicker;
  }

  toggleshowTimePicker() {
    if (this.showDatePicker) {
      this.showDatePicker = false;
    }
    this.showTimePicker = !this.showTimePicker;
    if (this.tt >= this.minTime) {
      this.schedule.scheduleTime = this.tt.toLocaleTimeString();
    }
    return this.showTimePicker;
  }

  formClick() {
    if (this.tt >= this.minTime) {
      this.schedule.scheduleTime = this.tt.toLocaleTimeString();
    }
  }

  public onSelectionDone(a) {
    this.showDatePicker = false;
    this.schedule.scheduleDate = a.toLocaleDateString();
  }
  save(form: any) {
    if (form.valid) {
      this.bookingService.setSchedule(this.schedule);
      if (this.service_id === '') {
        this.router.navigate(['booking/confirm']);
      } else {
        this.router.navigate(['booking/confirm'], { queryParams: { service_id: this.service_id } });
      }

    }
  }
  gotoPersonal(form: any) {
    if (form.valid) {
      this.save(form);
    }
    if (this.service_id === '') {
      this.router.navigate(['booking/personal']);
    } else {
      this.router.navigate(['booking/personal'], { queryParams: { service_id: this.service_id } });
    }

  }
}
