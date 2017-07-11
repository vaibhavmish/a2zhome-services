import { Component, Input, OnInit, trigger, state, style, transition, animate }
  from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';

import { Platform, platforms } from '../platforms.utils';
import { Properties } from '../properties.utils';


@Component({
  selector: 'share-button',
  template: `<a [href]="sanitize(this.url)" (click)="click($event)">
              <div  (click)="click($event)"
                class="n2s-share-btn n2s-share-btn-{{platform.name}} n2s-{{direction}}-margin
                  {{textEnabled ? 'n2s-share-btn-with-text' : '' }}">
                <i class="ic fa fa-{{platform.logoOfficial}}"></i>
                <span class="n2s-shareText" *ngIf="textEnabled">
                  <span class="n2s-shareText-primary">{{platform.text}} </span>
                </span>
              </div>
            </a>
            `,
  styleUrls: ['./share-button.css']
})
export class ShareButtonComponent implements OnInit {
  @Input() platformName;
  platform: Platform;
  @Input() textEnabled: boolean;
  @Input() addedText: string;
  @Input() direction = 'horizontal';
  @Input() properties: Properties;
  url: string;

  constructor(private sanitizer: DomSanitizer) {

  }

  ngOnInit() {
    this.platform = platforms[this.platformName];
    this.constructUrl();
  }

  click(event) {
    window.open(this.url, 'newwindow', 'width=1070, height=600');
    event.preventDefault();
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  constructUrl() {
    this.url = this.platform.url + this.properties.url;
    if (this.platform.properties) {
      for (const key in this.platform.properties) {
        // if the property has been found.
        const val = this.properties[this.platform.properties[key]];
        if (val) {
          this.url += `&${key}=${val}`;
        }
      }
    }
  }
}
