import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { Logger } from './../../logger/default-log.service';
import { GLOBAL_CONSTANTS } from '../../global-constants';
import { Service, Review } from '../../models';
import { HandyService, ReviewService } from '../../providers';

@Component({
    selector: 'app-service-search',
    templateUrl: './service-details.component.html',
    styleUrls: ['./service-details.component.scss']
})
export class ServiceDetailsComponent implements OnInit {
    _service: Service;
    _service_reviews: Review[];
    slides: Array<any>;
    banner: Array<any>;

    constructor(private router: Router, private logger: Logger, private reviewService: ReviewService, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this._service = JSON.parse(localStorage.getItem('SERVICE_DETAILS'));
        console.log('this._service', this._service);
        // localStorage.removeItem('SERVICE_DETAILS');
        this.fetchReviewData(this._service._id);

        this.banner = [
            {
                _id: 'pic01',
                photo: 'assets/images/paint.png'
            },
            {
                _id: 'pic02',
                photo: 'assets/images/Electricion.png'
            },
            {
                _id: 'pic03',
                photo: 'assets/images/allservices.png'
            },
            {
                _id: 'pic04',
                photo: 'assets/images/ac.png'
            }
        ];
    }

    fetchReviewData(service_id) {
        this.reviewService.getReviewsByService(service_id).subscribe(res => {
            this._service_reviews = res;
            console.log('this._service_reviews', this._service_reviews);
        });
    }

    bookService() {
        this.router.navigate(['booking/service-selection'], { queryParams: { service_id: this._service._id } });
    }
}
