import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
// import { InterceptorService } from 'ng2-interceptors';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { Location } from '../models';
import { BaseService } from './base.service';
import { GLOBAL_CONSTANTS } from '../global-constants';

@Injectable()
export class LocationService extends BaseService {
  private locationUrl: string;
  locationList: Array<Location>;

  constructor(private http: Http) {
    super();
    this.locationUrl = GLOBAL_CONSTANTS.BASE_API_URL + '/locations/enabled';
  }

  getLocations(): Observable<Location[]> {
    // return this.http.get(this.locationUrl)
    //   .map(res => {
    //     const data = res.json() as Location[];
    //     return data.sort(this.sortByCityName);
    //   })
    //   .catch(err => super.handleError(err));
    if (this.locationList) {
      return Observable.of(this.locationList);
    } else {
      return this.http.get(this.locationUrl)
        .map(res => {
          const data = res.json() as Location[];
          this.locationList = data.sort(this.sortByCityName); ;
          return data;
        })
        .catch(err => super.handleError(err));
    }
  }

  sortByCityName = (a, b) => {
    const nameA = a.city_name.toLowerCase();
    const nameB = b.city_name.toLowerCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  }

  IsLocationExists(locationList: Location[], city: string): boolean {
    return locationList.filter(item => item.city_name === city).length > 0;
  }

}


//https://coryrylan.com/blog/angular-observable-data-services
