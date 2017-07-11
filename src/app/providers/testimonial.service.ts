import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { Location, Testimonial } from '../models';
import { BaseService } from './base.service';
import { GLOBAL_CONSTANTS } from '../global-constants';

@Injectable()
export class TestimonialService extends BaseService {
  private locationUrl: string;

  constructor(private http: Http) {
    super();
    this.locationUrl = GLOBAL_CONSTANTS.BASE_API_URL + '/locations/enabled';
  }

  getTestimonials(): Observable<Testimonial[]> {
    return this.http.get(`${GLOBAL_CONSTANTS.BASE_API_URL}/testimonials`)
      .map(res => res.json() as Testimonial[])
      .catch(err => super.handleError(err));
  }

}

