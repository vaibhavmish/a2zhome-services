import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-comp-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {
  public slides: Array<any> = [];
  constructor() {
  }

  ngOnInit() {
    this.slides = [
      {
        '_id': '58dcf966734d1d01a2382743',
        'photo': [
          'assets/images/client-1.png',
          'assets/images/client-2.png',
          'assets/images/client-3.png'
        ]
      },
      {
        '_id': '58dcf966734d1d01a2382744',
        'photo': [
          'https://s3.ap-south-1.amazonaws.com/handy-api/1490784530432_fridge.jpg',
          'https://s3.ap-south-1.amazonaws.com/handy-api/1492761456861_handy_services.jpg',
          'assets/images/client-3.png'
        ]
      }
    ];

  }

}