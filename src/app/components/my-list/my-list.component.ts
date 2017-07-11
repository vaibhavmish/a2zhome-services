import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-my-list-component',
  templateUrl: './my-list.component.html',
  styleUrls: ['./my-list.component.scss']
})
export class MyListComponent implements OnInit {
  @Input() source: Array<any>;
  @Input() headerText: string;
  @Output() onSelectionChange: EventEmitter<any> = new EventEmitter();
  @Input() showHeaderRowCount = false;
  @Input() selected = 1;
  @Input() multiple = false;

  _selectedItems: Array<string>;

  constructor() {
  }

  ngOnInit() {
    this._selectedItems = [];
  }

  selectItem(item) {
    this.selected = item._id;
    if (this.multiple) {
      this.syncItems(item._id);
      this.onSelectionChange.emit(this._selectedItems);
    } else {
      this.onSelectionChange.emit(item.value);
    }

  }

  syncItems(item: string) {
    if (this._selectedItems.filter(data => data === item).length === 0) {
      this._selectedItems.push(item);
    } else {
      this._selectedItems = this._selectedItems.filter(data => data !== item);
    }
  }

  isSelectedItem(item: string): boolean {
    return this._selectedItems.filter(data => data === item).length > 0 ? true : false;
  }
}
