import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit {
  @Output()
  change: EventEmitter<string> = new EventEmitter<string>();
  selValue = '0';

  ratingData = [
    { value: '5', title: '5 stars', cssClass: 'full' },
    { value: '4.5', title: '4.5 stars', cssClass: 'half' },
    { value: '4', title: '4 stars', cssClass: 'full' },
    { value: '3.5', title: '3.5 stars', cssClass: 'half' },
    { value: '3', title: '3 stars', cssClass: 'full' },
    { value: '2.5', title: '2.5 stars', cssClass: 'half' },
    { value: '2', title: '2 stars', cssClass: 'full' },
    { value: '1.5', title: '1.5 stars', cssClass: 'half' },
    { value: '1', title: '1 star', cssClass: 'full' },
    { value: '.5', title: '.5 star', cssClass: 'half' }
  ];
  ratingID = [];
  constructor() { }

  ngOnInit() {
    for (let i = 0; i < 10; i++) {
      const id = this.generateUUID();
      this.ratingID.push(id);
    }
  }

  onSelectionChange(event: Event, val: string) {
    event.stopPropagation();
    this.selValue = val;
    this.change.emit(val);
  }

  generateUUID() {
    return 'xxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  isSel(val: string): boolean {
    return parseFloat(val) <= parseFloat(this.selValue);
  }
}
