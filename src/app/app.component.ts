import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { Logger } from './logger/default-log.service';
import { GLOBAL_CONSTANTS } from './global-constants';
import { LoaderService } from './providers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  showLoader: boolean;
  public options = {
    position: ['bottom', 'right'],
    timeOut: 3000,
    lastOnBottom: true,
  };

  constructor(
    private loaderService: LoaderService,
    private logger: Logger,
    private _router: Router
  ) {
    this._router.events.forEach((event) => {
      if (GLOBAL_CONSTANTS.trace_route === 'true') {
        // if (event instanceof NavigationEnd) {
        //   console.log(event);
        // }
        console.log(event);
        // NavigationEnd
        // NavigationCancel
        // NavigationError
        // RoutesRecognized
      }
    });

  }

  ngOnInit() {
    this.logger.log('GLOBAL_CONSTANTS', GLOBAL_CONSTANTS);
    // http://stackoverflow.com/questions/41977667/angular2-view-does-not-scroll-to-top-after-route-navigation
    this.loaderService.status.subscribe((val: boolean) => {
      this.showLoader = val;
    });
    this._router.events.subscribe((event: NavigationEnd) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }
}
