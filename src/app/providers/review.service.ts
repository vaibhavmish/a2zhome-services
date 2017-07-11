import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

import { Review, ReviewReq } from '../models';
import { BaseService } from './base.service';
import { GLOBAL_CONSTANTS } from '../global-constants';


@Injectable()
export class ReviewService extends BaseService {

          constructor(private http: Http) {
                    super();
          }

          getReviews(service_id: string): Observable<Review[]> {
                    const headers = new Headers({ 'Content-Type': 'application/json' });
                    const options = new RequestOptions({ headers: headers });

                    return this.http.get(`${GLOBAL_CONSTANTS.BASE_API_URL}/service/reviews?service_id=${service_id}`)
                              .map(res => {
                                        const result = res.json();
                                        return this.buildReviewData(result);
                              })
                              .catch((error: any) => Observable.throw(error.json().error || 'Server Error'));
          }

          addReview(req: ReviewReq): Observable<string> {
                    const bodyString = JSON.stringify(req);
                    const headers = new Headers({ 'Content-Type': 'application/json' });
                    const options = new RequestOptions({ headers: headers });

                    return this.http.post(`${GLOBAL_CONSTANTS.BASE_API_URL}/review`, bodyString, options)
                              .map(res => res.json().message as string)
                              .catch((error: any) => Observable.throw(error.json().error || 'Server Error'));
          }

          buildReviewData(result: any): Review[] {
                    const reviewList: Review[] = [];
                    result.map(res => {
                              const data = new Review();
                              data._id = res._id;
                              data.created_at = res.created_at;
                              data.comment = res.comment;
                              data.overall_rating = res.overall_rating;
                              data.service_location = res.service.location;
                              data.cust_id = res.cus.id;
                              data.cust_name = res.cus.name;
                              if (!res.cus.photo || res.cus.photo === '') {
                                        data.cust_photo = 'assets/images/empty-avatar.png';
                              } else {
                                        data.cust_photo = res.cus.photo;
                              }

                              reviewList.push(data);
                    });
                    return reviewList;
          }

}