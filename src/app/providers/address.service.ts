import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

import { Address } from '../models';
import { BaseService } from './base.service';
import { GLOBAL_CONSTANTS } from '../global-constants';


@Injectable()
export class AddressService extends BaseService {

    constructor(private http: Http) {
        super();
    }

    addAddress(req: Address): Observable<string> {
        const bodyString = JSON.stringify(req);
        const headers = new Headers({
            'Content-Type': 'application/json'
        });
        const options = new RequestOptions({
            headers: headers
        });
        return this.http.post(`${GLOBAL_CONSTANTS.BASE_API_URL}/add/address`, bodyString, options)
            .map(res => res.json().message as string)
            .catch((error: any) => Observable.throw(error.json().error || 'Server Error'));
    }

    removeAddress(user_id: string, addr_id: string): Observable<string> {
        const req = {
            user_id: user_id,
            addr_id: addr_id
        };
        const bodyString = JSON.stringify(req);
        const headers = new Headers({
            'Content-Type': 'application/json'
        });
        const options = new RequestOptions({
            headers: headers
        });

        return this.http.post(`${GLOBAL_CONSTANTS.BASE_API_URL}/remove/address?user_id=${user_id}&addr_id=${addr_id}`, bodyString, options)
            .map(res => res.json().message as string)
            .catch((error: any) => Observable.throw(error.json().error || 'Server Error'));
    }

    getAllAddress(user_id: string): Promise<Address[]> {
        return this.http.get(`${GLOBAL_CONSTANTS.BASE_API_URL}/address/all?id=${user_id}`)
            .toPromise()
            .then(response => response.json() as Address[])
            .catch(super.handleError);
    }

    getCompleteAddress(address: Address) {
        const addr = `${(address.houseno || '')}, ${(address.landmark || ' ')},${(address.road || '')}, ${(address.area || ' ')}, ${(address.city || ' ')}-${(address.zip_code || ' ')}. ${(address.state || ' ')}`;
        return addr;
    }


}