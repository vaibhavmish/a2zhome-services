import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {
  constructor() {}

  getItem(key: string, item?: string) {
    const data = localStorage.getItem(key);
    if (!item) {
      return data;
    }
    if (data) {
      return this.getValue(JSON.parse(data), item);
    }
    return data || null;
  }

  setItem(key: string, value: any) {
    localStorage.setItem(key, value);
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
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
