import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-comp-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingComponent implements OnInit {
  @Input()
  title: string;

  constructor() { }

  ngOnInit() {
    if (!this.title) {
      this.title = 'LOADING';
    }
  }

}
