import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-share-button',
  templateUrl: './share-button.component.html',
  styleUrls: ['./share-button.component.css']
})
export class ShareButtonComponent implements OnInit {
  @Input() referalcode = '';
  platform = {
    facebook: '',
    twitter: ''
  };
  fb_url = '';
  whatsup_url = '';
  twitter_url = '';

  constructor() { }

  ngOnInit() {
    const url = this.getMetaContent('og:url') || window.location.href.toString();
    const title = this.getMetaContent('og:title') || document.title;
    let description = this.getMetaContent('og:description');
    description = description.replace('_ReferalCode_', this.referalcode);
    this.platform['facebook'] = `https://www.facebook.com/sharer/sharer.php?u=${url}&title=${title}&description=${description}`;
    this.platform['twitter'] = `https://twitter.com/intent/tweet?url=${url}&text=${description}`;
    this.whatsup_url = `whatsapp://send?text=${title} - ${description}`;
  }

  getMetaContent(property: string): string {
    const elem = document.querySelector(`meta[property='${property}']`);
    if (elem) {
      return elem.getAttribute('content');
    }
    return '';
  }

  click(key) {
    // tslint:disable-next-line:max-line-length
    const url = this.platform[key];
    window.open(url, 'newwindow', 'width=600, height=600');
    event.preventDefault();
  }

}
