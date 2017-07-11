import { Component, OnInit } from '@angular/core';

import { RequestCallback } from '../../models';
import { CommonService, LoaderService } from '../../providers';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {
  userData: RequestCallback = new RequestCallback();
  showForm = true;
  message: string;

  constructor(
    private commonService: CommonService,
    private loaderService: LoaderService
  ) { }

  ngOnInit() {
    this.showForm = true;
  }

  submitRequestCallback(model: RequestCallback, isValid: boolean, f: any) {
    if (isValid) {
      this.loaderService.display(true);
      this.commonService.requestCallback(model)
        .subscribe(res => {
          this.showForm = false;
          this.message = 'Thank You!! We will contact you soon.';
          this.loaderService.display(false);
        },
        err => {
          this.loaderService.display(false);
        });
    }
  }

}
