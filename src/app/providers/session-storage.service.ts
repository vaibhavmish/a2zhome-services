import { Injectable } from '@angular/core';

@Injectable()
export class SessionStorageService {

  constructor() { }

  getItem(key: string, item?: string) {
    const data = sessionStorage.getItem(key);
    if (!item) {
      return data;
    }
    if (data) {
      return this.getValue(JSON.parse(data), item);
    }
    return data || null;
  }

  setItem(key: string, value: any) {
    sessionStorage.setItem(key, value);
  }

  removeItem(key: string) {
    sessionStorage.removeItem(key);
  }

  private getValue(source: any, item: string): any {
    for (const key in source) {
      if (source.hasOwnProperty(key) && key === item) {
        return source[key];
      }
    }
    return '';
  }
}
