import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/toPromise';

import { Service } from '../models';
import { BaseService } from './base.service';

import { GLOBAL_CONSTANTS } from '../global-constants';

@Injectable()
export class HandyService extends BaseService {
  private serviceUrl: string;
  servicesByCity = new Map<string, Observable<Service[]>>();
  constructor(private http: Http) {
    super();
    this.serviceUrl = GLOBAL_CONSTANTS.BASE_API_URL + '/services';
  }

  getServices(): Observable<Service[]> {
    return this.http.get(this.serviceUrl)
      .map(res => res.json() as Service[])
      .catch(err => super.handleError(err));
  }

  getServicesByCity(city: string): Observable<Service[]> {
     const serviceList = this.http.get(this.serviceUrl + `/all?city=${city}`)
        .map(res => res.json() as Service[])
        .publishReplay(1, 30000)
        .refCount()
        .take(1)
        .catch(err => super.handleError(err));
      this.servicesByCity.set(city, serviceList);
      return this.servicesByCity.get(city);
    // if (!this.servicesByCity.get(city)) {
    //   const serviceList = this.http.get(this.serviceUrl + `/all?city=${city}`)
    //     .map(res => res.json() as Service[])
    //     .publishReplay(1, 30000)
    //     .refCount()
    //     .take(1)
    //     .catch(err => super.handleError(err));
    //   console.log('publishReplay is set by at ', new Date, city);
    //   this.servicesByCity.set(city, serviceList);
    // }
    // console.log('publishReplay', this.servicesByCity.get(city));
    // return this.servicesByCity.get(city);
  }

  getServiceName(serviceId: string): Promise<string> {
    return this.http.get(`${GLOBAL_CONSTANTS.BASE_API_URL}/service?service_id=${serviceId}`)
      .toPromise()
      .then(res => {
        return res.json().name as string;
      })
      .catch(err => {
        return Promise.reject(err.message || err);
      });
  }

}

// https://stackoverflow.com/questions/43391003/angular2-rxjs-caching-a-service-that-takes-a-parameter/43391755
// You can use a Map to maintain the teamID/team association (I didn't touch the Observable creation part):

// summaries = new Map < number, Observable < Team >> ();

// getTeam(id: number) {
//   if (!this.summaries.get(id)) {
//     let team = this.http.get('http://locahost:8080/teams/' + id)
//       .map((response: Response) => response.json())
//       .publishReplay(1, 3000)
//       .refCount()
//       .take(1);
//     this.summaries.set(id, team)
//   }
//   return this.summaries.get(id);
// }