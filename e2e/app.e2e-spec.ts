import { NgCliLatestPage } from './app.po';

describe('ng-cli-latest App', () => {
  let page: NgCliLatestPage;

  beforeEach(() => {
    page = new NgCliLatestPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
