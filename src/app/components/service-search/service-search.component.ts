import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { GLOBAL_CONSTANTS } from '../../global-constants';
import { Service } from '../../models';
import { HandyService, BroadcastService } from '../../providers';

@Component({
  selector: 'app-service-search',
  templateUrl: './service-search.component.html',
  styleUrls: ['./service-search.component.scss']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceSearchComponent implements OnInit, OnDestroy {
  serviceData: Array<Service>;
  terms: string;
  subscription: Subscription;
  constructor(
    private service: HandyService,
    private broadcastService: BroadcastService
  ) { }

  ngOnInit() {
    this.fetchService();
    this.subscription = this.broadcastService.on(GLOBAL_CONSTANTS.BROADCAST_CITY)
      .subscribe(data => {
        this.serviceData = null;
        this.fetchService();
      });
  }

  fetchService() {
    if (localStorage.getItem(GLOBAL_CONSTANTS.LS_CITY)) {
      const city = localStorage.getItem(GLOBAL_CONSTANTS.LS_CITY);
      this.service.getServicesByCity(city)
        .subscribe(res => {
          this.serviceData = res;
        });
    } else {
      this.service.getServices()
        .subscribe(res => {
          this.serviceData = res;
        });
    }
  }

  ngOnDestroy() {
    console.log('service-search-destroy..');
    this.subscription.unsubscribe();
  }

}
