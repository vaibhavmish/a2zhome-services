import { Component, OnInit } from '@angular/core';
import { Testimonial } from './../../models/testimonial.model';

import { TestimonialService } from '../../providers';


@Component({
  selector: 'app-media-coverage',
  templateUrl: './media-coverage.component.html',
  styleUrls: ['./media-coverage.component.scss']
})
export class MediaCoverageComponent implements OnInit {
  testimonials: Testimonial[];

  constructor(
    private testimonialService: TestimonialService
  ) {
  }

  ngOnInit() {
    this.testimonialService.getTestimonials()
      .subscribe(res => {
        this.testimonials = this.rebuildData(res);
      });
  }

  rebuildData(data: Testimonial[]) {
    const chunks = [];
    for (let i = 0; i < data.length;) {
      chunks.push(data.slice(i, i += 3));
    }
    return chunks;
  }

}
