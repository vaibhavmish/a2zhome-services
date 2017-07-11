import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { BaseService } from './base.service';
import { PackageForm, Package, PackageRequest, HomeMOPackage, CorporatePackage, Partner } from '../models';
import { GLOBAL_CONSTANTS } from '../global-constants';

@Injectable()
export class PackageService extends BaseService {

  _bookPackage: PackageRequest;

  constructor(private http: Http) {
    super();
  }

  form(req: PackageForm): Observable<string> {
    const bodyString = JSON.stringify(req);
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    const options = new RequestOptions({
      headers: headers
    });

    return this.http.post(`${GLOBAL_CONSTANTS.BASE_API_URL}/package/form`, bodyString, options)
      .map(res => res.json().price as string)
      .catch((error: any) => Observable.throw(error.json().error || 'Server Error'));
  }

  saveForm(req: PackageForm): Observable<string> {
    const bodyString = JSON.stringify(req);
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    const options = new RequestOptions({
      headers: headers
    });

    return this.http.post(`${GLOBAL_CONSTANTS.BASE_API_URL}/package/form`, bodyString, options)
      .map(res => res.json().price as string)
      .catch((error: any) => Observable.throw(error.json().error || 'Server Error'));
  }

  saveHomeMOPackageForm(req: HomeMOPackage): Observable<string> {
    const bodyString = JSON.stringify(req);
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    const options = new RequestOptions({
      headers: headers
    });

    return this.http.post(`${GLOBAL_CONSTANTS.BASE_API_URL}/create/hmp`, bodyString, options)
      .map(res => res.json().message as string)
      .catch((error: any) => Observable.throw(error.json().error || 'Server Error'));
  }

  saveCorporatePackageForm(req: CorporatePackage): Observable<string> {
    const bodyString = JSON.stringify(req);
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    const options = new RequestOptions({
      headers: headers
    });

    return this.http.post(`${GLOBAL_CONSTANTS.BASE_API_URL}/create/corporate`, bodyString, options)
      .map(res => res.json().message as string)
      .catch((error: any) => Observable.throw(error.json().error || 'Server Error'));
  }

  savePartnerForm(req: Partner): Observable<string> {
    const bodyString = JSON.stringify(req);
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    const options = new RequestOptions({
      headers: headers
    });

    return this.http.post(`${GLOBAL_CONSTANTS.BASE_API_URL}/create/partner`, bodyString, options)
      .map(res => res.json().message as string)
      .catch((error: any) => Observable.throw(error.json().error || 'Server Error'));
  }

  getPackagePrice(duration: string, totalVisit: string): Observable<string> {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    const options = new RequestOptions({
      headers: headers
    });

    return this.http.get(`${GLOBAL_CONSTANTS.BASE_API_URL}/price/package?duration=${duration}&total=${totalVisit}`, options)
      .map(res => res.json().price as string)
      .catch((error: any) => Observable.throw(error.json().error || 'Server Error'));
  }

  getUnlimitedPackagePrice(duration: string, area: string, num_services: string): Observable<string> {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    const options = new RequestOptions({
      headers: headers
    });

    return this.http.get(`${GLOBAL_CONSTANTS.BASE_API_URL}/price/package/unlimited?duration=${duration}&area=${area}&num_services=${num_services}`, options)
      .map(res => res.json().price as string)
      .catch((error: any) => Observable.throw(error.json().error || 'Server Error'));
  }

  getACPackagePrice(totalACUnits: string): Observable<string> {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    const options = new RequestOptions({
      headers: headers
    });

    return this.http.get(`${GLOBAL_CONSTANTS.BASE_API_URL}/price/package/ac?total=${totalACUnits}`, options)
      .map(res => res.json().price as string)
      .catch((error: any) => Observable.throw(error.json().error || 'Server Error'));
  }

  savePackage(req: PackageRequest): void {
    this._bookPackage = req;
  }

  getSavedPackage(): PackageRequest {
    return this._bookPackage;
  }

  bookPackage(req: PackageRequest): Observable<any> {
    const bodyString = JSON.stringify(req);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(`${GLOBAL_CONSTANTS.BASE_API_URL}/book/package`, bodyString, options)
      .map(res => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server Error'));
  }

  scheduleVerifyPackage(packageId: string, verificationDate: string, verificationTime: string, verification_address: string, number: string): Observable<any> {
    const req = {
      id: packageId,
      verification_date: verificationDate,
      verification_time: verificationTime,
      verification_address: verification_address,
      number: number
    };
    const bodyString = JSON.stringify(req);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(`${GLOBAL_CONSTANTS.BASE_API_URL}/schedule/verification/package`, bodyString, options)
      .map(res => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server Error'));
  }

  getUserPackages(user_id: string): Observable<Package[]> {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    const options = new RequestOptions({
      headers: headers
    });

    return this.http.get(`${GLOBAL_CONSTANTS.BASE_API_URL}/user/packages?user_id=${user_id}`, options)
      .map(res => res.json() as Package[])
      .catch((error: any) => Observable.throw(error.json().error || 'Server Error'));
  }

  bookServiceWithPackage(user_id: string, packageId: string, services: Array<string>, scheduled_date: string, scheduled_time: string, address: string, number: string): Observable<string> {
    const req = {
      user_id: user_id,
      package_id: packageId,
      services: services,
      scheduled_date: scheduled_date,
      scheduled_time: scheduled_time,
      address: address,
      number: number
    };
    const bodyString = JSON.stringify(req);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(`${GLOBAL_CONSTANTS.BASE_API_URL}/book/with/package`, bodyString, options)
      .map(res => res.json().message as string)
      .catch(super.handleError);
  }

}
