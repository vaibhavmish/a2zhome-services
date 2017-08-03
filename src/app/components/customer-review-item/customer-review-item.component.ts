import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'cm-customer-review-item',
  templateUrl: 'customer-review-item.component.html',
  styleUrls: ['customer-review-item.component.css']
})
export class CustomerReviewItemComponent implements OnInit {
  @Input() data: any;

  constructor() {}

  ngOnInit() {}
}
