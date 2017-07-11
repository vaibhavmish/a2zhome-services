import { CommonService } from './../../providers/common.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-comp-mobile-app',
  templateUrl: './mobile-app.component.html',
  styleUrls: ['./mobile-app.component.css']
})
export class MobileAppComponent implements OnInit {
  mobileNo: string;
  responseMessage: string;
  buttonText: string;

  constructor(private commonservice: CommonService) { }

  ngOnInit() {
    this.buttonText = 'Text App Link';
  }

  sendLink(formValid: boolean) {
    if (formValid) {
      this.buttonText = 'Please wait...';
      this.commonservice.sendLink(this.mobileNo)
        .subscribe(res => {
          this.buttonText = 'Text App Link';
          this.responseMessage = `Download link has been sent to ${this.mobileNo}`;
        });
    }
  }
}
