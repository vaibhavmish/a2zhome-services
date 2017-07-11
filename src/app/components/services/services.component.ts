import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Service } from '../../models';

@Component({
  selector: 'app-comp-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  @Input('data')
  serviceData: Service[];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  viewDeails(_service: Service) {
    localStorage.setItem('SERVICE_DETAILS', JSON.stringify(_service));
    const _serviceName = this.trim(_service.name.split(' ').join('-'));
    this.router.navigate(['/service', _serviceName]);
  }

  trim(data) {
    return data.replace(/^\s+|\s+$/gm, '');
  }
}
