import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comp-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss']
})
export class PackagesComponent implements OnInit {
  packageType: string;

  constructor(
    private router: Router
  ) {
  }

  ngOnInit() {
  }

  maintenancePackage() {
    this.router.navigate(['/maintenance-package']);
  }

  homeMakeoverPackage() {
    this.packageType = '1';
    this.router.navigate(['/package-form'], { queryParams: { 'form-type': this.packageType } });
  }

  corporatePackage() {
    this.packageType = '2';
    this.router.navigate(['/package-form'], { queryParams: { 'form-type': this.packageType } });
  }
}
