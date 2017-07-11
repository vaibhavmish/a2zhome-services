import { Component, OnInit } from '@angular/core';

import { Feedback } from '../../models';
import { CommonService, LoaderService } from '../../providers';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  message: string;
  showForm = true;
  feedbackForm: Feedback;

  constructor(
    private commonService: CommonService,
    private loaderService: LoaderService
  ) {
    this.feedbackForm = new Feedback();
  }

  ngOnInit() {
  }

  submitFeedback(model: Feedback, isValid: boolean, f: any) {
    if (isValid) {
      this.loaderService.display(true);
      this.commonService.feedback(model)
        .subscribe(res => {
          this.showForm = false;
          this.message = 'Thank You for your Feedback!!';
          this.loaderService.display(false);
        },
        err => {
          this.loaderService.display(false);
        });
    }
  }

}
