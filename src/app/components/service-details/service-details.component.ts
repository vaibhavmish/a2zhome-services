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

  constructor(
    private router: Router,
    private logger:Logger,
    private reviewService: ReviewService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this._service = JSON.parse(localStorage.getItem('SERVICE_DETAILS'));
    this.fetchReviewData(this._service._id);

    this.banner = [
      {
        '_id': 'asdsa',
        'photo': 'https://static.pexels.com/photos/221027/pexels-photo-221027.jpeg'
      },
      {
        '_id': 'asdsb',
        'photo': 'https://images.pexels.com/photos/327533/pexels-photo-327533.jpeg'
      },
      {
        '_id': 'asdsc',
        'photo': 'http://www.jaipurrepair.com/image/Air-Conditioner-Services.jpg'
      }

    ];
  }

  fetchReviewData(service_id) {
    this.reviewService.getReviewsByService(service_id)
      .subscribe(res => {
        this._service_reviews = this.rebuildData(res);
        this.logger.log(' this._service_reviews', this._service_reviews);
      });
  }

  rebuildData(data: Review[]) {
    const chunks = [];
    for (let i = 0; i < data.length; ) {
      chunks.push(data.slice(i, i += 3));
    }
    return chunks;
  }

  bookService() {
    this.router.navigate(['booking/service-selection'], { queryParams: { service_id: this._service._id } });
  }
}