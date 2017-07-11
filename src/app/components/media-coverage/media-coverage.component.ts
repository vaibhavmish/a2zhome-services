import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-media-coverage',
  templateUrl: './media-coverage.component.html',
  styleUrls: ['./media-coverage.component.scss']
})
export class MediaCoverageComponent implements OnInit {
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
        ],
        'link': [
          'http://google.com',
          'http://facebook.com',
          'http://twitter.com'
        ],
        'desc' : [
          'desc 1',
          'desc 2',
          'desc 3'
        ]
      },
      {
        '_id': '58dcf966734d1d01a2382744',
        'photo': [
          'https://s3.ap-south-1.amazonaws.com/handy-api/1490784530432_fridge.jpg',
          'https://s3.ap-south-1.amazonaws.com/handy-api/1492761456861_handy_services.jpg',
          'assets/images/client-3.png'
        ],
        'link': [
          'http://google.com',
          'http://facebook.com',
          'http://twitter.com'
        ],
        'desc' : [
          'desc 4',
          'desc 5',
          'desc 6'
        ]
      }
    ];
  }

}
