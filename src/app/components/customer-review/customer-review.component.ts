import { Component, OnInit } from '@angular/core';

import { GLOBAL_CONSTANTS } from './../../global-constants';
import { ReviewService, LocalStorageService } from '../../providers';
import { Review } from '../../models';

@Component({
  selector: 'app-comp-customer-review',
  templateUrl: './customer-review.component.html',
  styleUrls: ['./customer-review.component.scss']
})
export class CustomerReviewComponent implements OnInit {
  reviewList: Review[];

  constructor(
    private localStorageService: LocalStorageService,
    private reviewService: ReviewService) {
  }

  ngOnInit() {
    this.reviewService.getReviews()
      .subscribe(res => {
        this.reviewList = this.rebuildData(res);
      });
  }

  rebuildData(data: Review[]) {
    const chunks = [];
    for (let i = 0; i < data.length;) {
      chunks.push(data.slice(i, i += 3));
    }
    return chunks;
  }
}