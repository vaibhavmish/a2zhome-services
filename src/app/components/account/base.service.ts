import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/throw';

@Injectable()
export class BaseService {

  /**

* Handle any errors from the API

*/

  handleError(err) {
    let errMessage: string;
    if (err instanceof Response) {
      const body = err.json() || '';
      const error = body || JSON.stringify(body);
      errMessage = `${err.status} - ${err.statusText || ''} ${error}`;
    } else {
      errMessage = err.message ? err.message : err.toString();
    }
    return Observable.throw(errMessage);
  }


}
