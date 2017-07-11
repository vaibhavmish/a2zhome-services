import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { GLOBAL_CONSTANTS } from '../../../global-constants';
import { Service } from '../../../models';
import { LoaderService, HandyService, BookingService } from '../../../providers';

@Component({
  selector: 'app-service-selection',
  templateUrl: './service-selection.component.html',
  styleUrls: ['./service-selection.component.css']
})

export class ServiceSelectionComponent implements OnInit {
  serviceList: Array<Service>;
  terms: string;
  errorMessage: string;
  _selectedItems: Array<Service>;
  service_id: string;
  constructor(
    private service: HandyService,
    private loaderService: LoaderService,
    private bookingService: BookingService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.service_id = params['service_id'] || ''; // (+) converts string 'id' to a number
      this.init();
    });
  }

  init() {
    this.serviceList = this.bookingService.getServiceList();
    if (!this.serviceList) {
      if (localStorage.getItem(GLOBAL_CONSTANTS.LS_CITY)) {
        const city = localStorage.getItem(GLOBAL_CONSTANTS.LS_CITY);
        this.service.getServicesByCity(city)
          .subscribe(res => {
            this.serviceList = res;
            this.serviceList.map(item => {
              if (item._id === this.service_id) {
                item.selected = true;
              }
            });
          });
      } else {
        this.service.getServices()
          .subscribe(res => {
            this.serviceList = res;
            this.loaderService.display(false);
          });
      }
    } else {
      this.serviceList.map(item => {
        if (item._id === this.service_id) {
          item.selected = true;
        }
      });
      this.loaderService.display(false);
    }
  }

  goToPersonal() {
    if (this.selectedItemsCount() > 0) {
      this.bookingService.setServiceList(this.serviceList);
      if (this.service_id === '') {
        this.router.navigate(['booking/personal']);
      } else {
        this.router.navigate(['booking/personal'], { queryParams: { service_id: this.service_id } });
      }

    } else {
      this.errorMessage = 'Please select at least one service';
    }

  }

  selectedItemsCount(): number {
    const dd = this.serviceList.filter(data => data.selected === true);
    return dd.length;
  }

  select(item: any) {
    item.selected = !item.selected;
    this.serviceList.map((data) => {
      if (data.name === item.name) {
        data.selected = item.selected;
      }
    });
    const noOfService = this.selectedItemsCount();
    this.errorMessage = this.selectedItemsCount() > 0 ? '' : 'Please select at least one service';
  }

}
