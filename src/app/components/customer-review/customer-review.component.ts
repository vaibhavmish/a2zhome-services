import { Component, Input, OnInit } from '@angular/core';
import { Review } from '../../models';

@Component({
  selector: 'app-comp-customer-review',
  templateUrl: './customer-review.component.html',
  styleUrls: ['./customer-review.component.scss']
})
export class CustomerReviewComponent implements OnInit {
  reviewList: Review[];
  @Input() data: Review[];

  constructor() {}

  ngOnInit() {
    this.reviewList = this.data;
  }
}
