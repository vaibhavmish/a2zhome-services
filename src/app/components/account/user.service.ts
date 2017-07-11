import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';

import { LocalStorageService } from './../../providers/local-storage.service';
import { User } from './user.model';
import { BaseService } from './base.service';
import { GLOBAL_CONSTANTS } from '../../global-constants';

@Injectable()
export class UserService extends BaseService {
    private userUrl: string;

    constructor(private http: Http,
        private localStorageService: LocalStorageService) {
        super();
        this.userUrl = GLOBAL_CONSTANTS.BASE_API_URL + '/user/update?id';
    }

    public getUserDetails(userId: string): Promise<User> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.get(`${GLOBAL_CONSTANTS.BASE_API_URL}/user?id=${userId}`)
            .toPromise()
            .then(res => res.json() as User)
            .catch(super.handleError);
    }

    public updateUser(model: User): Promise<string> {
        const _id = this.localStorageService.getItem(GLOBAL_CONSTANTS.LS_LOGIN_USER_DATA, '_id');
        const bodyString = JSON.stringify(model);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return this.http.post(`${GLOBAL_CONSTANTS.BASE_API_URL}/user/update?id=${_id}`, bodyString, options)
            .toPromise()
            .then(res => res.json().message as string)
            .catch(super.handleError);
    }

    public uploadProfileImage(formData: FormData): Promise<string> {
        return this.http.post(`${GLOBAL_CONSTANTS.BASE_API_URL}/image`, formData)
            .toPromise()
            .then(res => res.json().url as string)
            .catch(super.handleError);
    }

}

