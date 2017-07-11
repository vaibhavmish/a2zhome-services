import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-navbar-comp',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input()
  step: number;

  constructor() { }

  ngOnInit() {
    this.step = this.step || 1;
  }

}
