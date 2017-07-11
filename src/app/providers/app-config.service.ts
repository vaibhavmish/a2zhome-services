import { GLOBAL_CONSTANTS } from './../global-constants';
import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export class AppConfigService {

    private _config: any;

    constructor(private http: Http) { }

    load(): Promise<any> {
        return this.http.get('./app.config.json')
            .map((response: Response) => response.json())
            .toPromise()
            .then(data => {
                this._config = data;
                console.log('config', this._config);
                this.setUpEnvVaraibles();
                return data;
            });
    }

    private setUpEnvVaraibles(){
        GLOBAL_CONSTANTS.BASE_API_URL = this.getWebApiUrl();
         GLOBAL_CONSTANTS.AUTH_CONFIG = this.getValue(this._config, 'authConfig');
         GLOBAL_CONSTANTS.showLog = this.getValue(this._config, 'showLog');
         GLOBAL_CONSTANTS.trace_route = this.getValue(this._config, 'trace_route');
    }
    get config(): any {
        return this._config;
    }

    private getWebApiUrl() {
        return this.getValue(this._config, 'WEB_API_URL');
    }

    private getAuthConfig() {
        return this.getValue(this._config, 'authConfig');
    }

    private getValue(source: any, item: string): any {
        for (const key in source) {
            if (source.hasOwnProperty(key) && key === item) {
                return source[key];
            }
        }
        return '';
    }

    // ref: https://gillespie59.github.io/2016/12/04/angular2-code-before-rendering.html
}
