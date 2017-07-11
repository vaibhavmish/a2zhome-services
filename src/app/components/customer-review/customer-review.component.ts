import { Testimonial } from './../../models/testimonial.model';
import { Component, OnInit } from '@angular/core';

import { TestimonialService } from '../../providers';
import { Service } from '../../models';

@Component({
  selector: 'app-comp-customer-review',
  templateUrl: './customer-review.component.html',
  styleUrls: ['./customer-review.component.scss']
})
export class CustomerReviewComponent implements OnInit {
  testimonials: Testimonial[];

  constructor(private testimonialService: TestimonialService) {
  }

  ngOnInit() {
    this.testimonialService.getTestimonials()
      .subscribe(res => {
        this.testimonials = this.rebuildData(res);
      });
  }

  rebuildData(data: Testimonial[]) {
    const chunks = [];
    for (let i = 0; i < data.length; ) {
      chunks.push(data.slice(i, i += 3));
    }
    return chunks;
  }
}