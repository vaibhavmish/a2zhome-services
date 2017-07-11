import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { RequestCallback, Feedback, Message, Client } from '../models';
import { BaseService } from './base.service';
import { GLOBAL_CONSTANTS } from '../global-constants';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class CommonService extends BaseService {
  private requestCallbackUrl: string;

  constructor(private http: Http) {
    super();
    this.requestCallbackUrl = GLOBAL_CONSTANTS.BASE_API_URL + '/request/callback';
  }

  sendLink(mobileNo: string): Observable<string> {
    return this.http.get(`${GLOBAL_CONSTANTS.BASE_API_URL}/send/link?number=${mobileNo}`)
      .map(res => {
        return res.json() as string;
      })
      .catch(err => super.handleError(err));
  }

  getClients(): Observable<Client[]> {
    return this.http.get(`${GLOBAL_CONSTANTS.BASE_API_URL}/client`)
      .map(res => {
        return res.json() as Client[];
      })
      .catch(err => super.handleError(err));
  }

  requestCallback(req: RequestCallback): Observable<RequestCallback[]> {
    const bodyString = JSON.stringify(req);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });

    return this.http.post(this.requestCallbackUrl, bodyString, options)
      .map(res => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server Error'));
  }

  feedback(req: Feedback): Observable<Feedback[]> {
    const bodyString = JSON.stringify(req);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });

    return this.http.post(GLOBAL_CONSTANTS.BASE_API_URL + '/feedback', bodyString, options)
      .map(res => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server Error'));
  }

  saveMessage(req: Message): Observable<string> {
    const bodyString = JSON.stringify(req);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });

    return this.http.post(`${GLOBAL_CONSTANTS.BASE_API_URL}/save/message`, bodyString, options)
      .map(res => {
        const response = res.json();
        if (response.message) {
          return response.message;
        }
      })
      .catch((error: any) => Observable.throw(error.json().error || 'Server Error'));
  }

}
