import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { BroadcastService } from './broadcast.service';
import { LocalStorageService } from './local-storage.service';

import { GeoLocation, Location } from '../models';
import { BaseService } from './base.service';
import { GLOBAL_CONSTANTS } from '../global-constants';

const GEOLOCATION_ERRORS = {
    'errors.location.unsupportedBrowser': 'Browser does not support location services',
    'errors.location.permissionDenied': 'You have rejected access to your location',
    'errors.location.positionUnavailable': 'Unable to determine your location',
    'errors.location.timeout': 'Service timeout has been reached'
};

@Injectable()
export class GeoLocationService extends BaseService {
    options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    constructor(
        private http: Http,
        private broadcastService: BroadcastService,
        private localtStorageService: LocalStorageService
    ) {
        super();
    }

    public getGeoLocation(): Observable<any> {
        return Observable.create(observer => {
            if (window.navigator && window.navigator.geolocation) {
                window.navigator.geolocation.getCurrentPosition((position) => {
                    observer.next(position);
                },
                    (error) => {
                        switch (error.code) {
                            case 1:
                                observer.error(GEOLOCATION_ERRORS['errors.location.permissionDenied']);
                                break;
                            case 2:
                                observer.error(GEOLOCATION_ERRORS['errors.location.positionUnavailable']);
                                break;
                            case 3:
                                observer.error(GEOLOCATION_ERRORS['errors.location.timeout']);
                                break;
                        }
                    },
                    this.options);
            } else {
                observer.error(GEOLOCATION_ERRORS['errors.location.unsupportedBrowser']);
            }
        });
    }

    public getCity(): Observable<string> {
        return this.getGeoLocation()
            .map(res => res)
            .flatMap(position => {
                return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&sensor=false`)
                    .map(res => {
                        const res_data = res.json();
                        const city = res_data.results[0].address_components.reduce((data, value) => {
                            if (value.types[0] === 'locality') {
                                data = value.long_name;
                            }
                            return data;
                        }, '');
                        return city;
                    });
            });
    }
}

