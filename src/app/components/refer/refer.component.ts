import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { GLOBAL_CONSTANTS } from './../../global-constants';
import { LocalStorageService } from './../../providers';

@Component({
  selector: 'app-refer',
  templateUrl: './refer.component.html',
  styleUrls: ['./refer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReferComponent implements OnInit {
  userId = '';
  _referal_code = '';

  constructor(
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    this.userId = this.localStorageService.getItem(GLOBAL_CONSTANTS.LS_LOGIN_USER_DATA, '_id');
    this._referal_code = this.localStorageService.getItem(GLOBAL_CONSTANTS.LS_LOGIN_USER_DATA, 'referal_code');

  }

  copyToClipboard() {
    const data = `I'm giving you 50 off on your first Booking. To accept, use code '{{_referal_code}}' to sign up. Enjoy! Details:https://play.google.com/store/apps/details?id=in.handyservices.handyservices&referrer=utm_source%3Dapp_share%26utm_content%3DHS-REFER-13759010101%26utm_campaign%3D1`;
    this.copyTextToClipboard(data);
  }

  copyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      const msg = successful ? 'successful' : 'unsuccessful';
      console.warn('Copying text command was ' + msg);
    } catch (err) {
      console.log('Oops, unable to copy');
    }
    document.body.removeChild(textArea);
  }

}
