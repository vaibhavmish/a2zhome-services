import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { GLOBAL_CONSTANTS } from './../global-constants';
import { Logger } from '../logger/default-log.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';

import { LoginUserRequest, LoginUserResponse, RegisterUserRequest, RegisterUserResponse } from '../models';

import { BaseService } from './base.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class AuthService extends BaseService {
    private forgotPasswordUrl: string;
    private registerUserUrl: string;
    private loginUserUrl: string;
    private sendOtpUrl: string;
    private verifyOtpUrl: string;
    public redirectUrl: string;
    private baseURL = window.location.origin;
    private authConfig = {
        facebook: {
            clientId: '635586089948511',
            client_secret: '5f131445b966ef80608d501c2f2b4ade',
            redirectURI: `${this.baseURL}/welcome?client=facebook`
        },
        google: {
            clientId: '219459112816-ja2kh2465ic9u0vbjc68fmagaf63v9mo.apps.googleusercontent.com',
            client_secret: 'Uhtq_mvsSxJsEeE5tNfjd__k',
            redirectURI: `${this.baseURL}/welcome?client=google`
        }
    };
    constructor(private http: Http, private logger: Logger) {
        super();
        this.setAuthVariable();
    }

    setAuthVariable() {
        this.authConfig.facebook.clientId = GLOBAL_CONSTANTS.AUTH_CONFIG.facebook.clientId;
        this.authConfig.facebook.client_secret = GLOBAL_CONSTANTS.AUTH_CONFIG.facebook.client_secret;
        this.authConfig.google.clientId = GLOBAL_CONSTANTS.AUTH_CONFIG.google.clientId;
        this.authConfig.google.client_secret = GLOBAL_CONSTANTS.AUTH_CONFIG.google.client_secret;
    }

    public isAuthenticated(): boolean {
        const isLogged = localStorage.getItem(GLOBAL_CONSTANTS.LS_IS_LOGGED_IN);
        if (isLogged && isLogged.toLowerCase() === 'true') {
            return true;
        } else {
            return false;
        }
    }

    public registerUser(user: RegisterUserRequest): Observable<RegisterUserResponse> {
        const bodyString = JSON.stringify(user);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        // this.logger.log(`AuthService:registerUser()-request: ${bodyString}`);
        return this.http
            .post(`${GLOBAL_CONSTANTS.BASE_API_URL}/user/register`, bodyString, options)
            .map(res => {
                const response = res.json();
                this.logger.log(response);
                const registerUserResponse = new RegisterUserResponse();
                if (response.message) {
                    registerUserResponse.message = response.message;
                } else {
                    registerUserResponse.message = GLOBAL_CONSTANTS.SUCCESS;
                }
                registerUserResponse._id = response._id;
                registerUserResponse.mobile = response.number;
                registerUserResponse.email = response.email;
                registerUserResponse.name = response.name;
                registerUserResponse.referal_code = response.referal_code;
                registerUserResponse.pass = response.pass;
                registerUserResponse.user_type = response.user_type;
                registerUserResponse.verified = response.verified;
                return registerUserResponse;
            })
            .catch(err => super.handleError(err));
    }

    public loginUser(user: LoginUserRequest): Observable<LoginUserResponse> {
        const bodyString = JSON.stringify(user);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return this.http
            .post(`${GLOBAL_CONSTANTS.BASE_API_URL}/user/login`, bodyString, options)
            .map(res => {
                const response = res.json();
                const loginUserResponse = new LoginUserResponse();
                if (response.message) {
                    loginUserResponse.message = response.message;
                } else {
                    loginUserResponse.message = GLOBAL_CONSTANTS.SUCCESS;
                    localStorage.setItem(GLOBAL_CONSTANTS.LS_IS_LOGGED_IN, 'true');
                    localStorage.setItem(GLOBAL_CONSTANTS.LS_MOBILE, response.number);
                    localStorage.setItem(GLOBAL_CONSTANTS.LS_LOGGEDINUSERNAME, response.name);
                    localStorage.setItem(GLOBAL_CONSTANTS.LS_LOGIN_USER_DATA, JSON.stringify(response));
                }
                loginUserResponse._id = response._id;
                loginUserResponse.mobile = response.number;
                loginUserResponse.email = response.email;
                loginUserResponse.name = response.name;
                loginUserResponse.photo = response.photo;
                loginUserResponse.address = response.address;
                loginUserResponse.referal_code = response.referal_code;
                return loginUserResponse;
            })
            .catch(err => super.handleError(err));
    }

    public resetPassword(email: string): Observable<string> {
        const request = {
            email: email
        };
        this.logger.log(this.forgotPasswordUrl);

        const bodyString = JSON.stringify(request);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        this.logger.log(bodyString);
        return this.http
            .post(`${GLOBAL_CONSTANTS.BASE_API_URL}/user/forgot-password`, bodyString, options)
            .map(res => {
                const result = res.json();
                this.logger.log(result);
                if (result && result.message) {
                    return result.message;
                }
            })
            .catch(err => super.handleError(err));
    }

    public changePassword(user_id: string, old_password: string, new_password: string): Observable<any> {
        const request = {
            user_id,
            old_pass: old_password,
            new_pass: new_password
        };

        const bodyString = JSON.stringify(request);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        this.logger.log(bodyString);
        return this.http.post(`${GLOBAL_CONSTANTS.BASE_API_URL}/update/password`, bodyString, options).map(res => res.json()).catch(err => super.handleError(err));
    }
    public auth(provider: string): void {
        if (provider === 'google' && !this.isAuthenticated()) {
            // const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${this.authConfig.google.clientId}&redirect_uri=${this.authConfig.google.redirectURI}&scope=email%20profile`;
            // const options = `width=500,height=500, left=${(window.outerWidth - 500) / 2},top=${(window.outerHeight - 500) / 2.5}`;
            // const popup = window.open(url, 'HandyAppWindow', options);
            // window.focus();
            // window.addEventListener('message', function (event) {
            //   alert('hi');
            //   this.logger.log(event.origin, window.location.origin);
            //   if (event.origin === window.location.origin) {
            //     this.logger.log(event.data);
            //     popup.close();
            //   }
            // });
            window.location.href =
                'https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=' +
                this.authConfig.google.clientId +
                '&redirect_uri=' +
                this.authConfig.google.redirectURI +
                '&scope=email%20profile';
        } else if (provider === 'facebook' && !this.isAuthenticated()) {
            window.location.href =
                'https://www.facebook.com/v2.8/dialog/oauth?client_id=' + this.authConfig.facebook.clientId + '&redirect_uri=' + this.authConfig.facebook.redirectURI + '&scope=email';
        }
    }

    public authGoogle(token: string): Observable<any> {
        const accessTokenUrl = 'https://www.googleapis.com/oauth2/v4/token';

        const params = {
            code: token,
            client_id: this.authConfig.google.clientId,
            client_secret: this.authConfig.google.client_secret,
            redirect_uri: this.authConfig.google.redirectURI,
            grant_type: 'authorization_code'
        };
        const token_request = `code=${token}&client_id=${this.authConfig.google.clientId}&client_secret=${this.authConfig.google.client_secret}&redirect_uri=${this.authConfig.google
            .redirectURI}&grant_type=authorization_code`;
        const request_length = token_request.length;
        const bodyString = token_request;
        const headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        const options = new RequestOptions({ headers: headers });

        return this.http
            .post(accessTokenUrl, bodyString, options)
            .map(res => {
                return res.json().access_token;
            })
            .flatMap(access_token => {
                return this.getGoogleProfile(access_token);
            })
            .flatMap(userProfile => {
                return this.loginUserWithGoogle(userProfile.id, userProfile.email, userProfile.name);
            })
            .catch((error: any) => Observable.throw(error.json().error || 'Server Error'));
    }

    private loginUserWithGoogle(id: string, email: string, name: string): Observable<any> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        const req = {
            name: name,
            email: email
        };
        const bodyString = JSON.stringify(req);
        return this.http.post(`${GLOBAL_CONSTANTS.BASE_API_URL}/user/login/google?id=${id}`, bodyString, options).map(res => res.json()).catch(err => super.handleError(err));
    }

    private loginUserWithFacebook(id: string, email: string, name: string): Observable<any> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        const req = {
            name: name,
            email: email
        };
        const bodyString = JSON.stringify(req);
        return this.http
            .post(`${GLOBAL_CONSTANTS.BASE_API_URL}/user/login/fb?id=${id}`, bodyString, options)
            .map(res => {
                this.logger.log('loginUserWithFacebook-resp', res);
                return res.json();
            })
            .catch(err => super.handleError(err));
    }

    private getGoogleProfile(accessToken: string): Observable<any> {
        const peopleApiUrl = 'https://www.googleapis.com/oauth2/v2/userinfo?fields=email%2Cfamily_name%2Cgender%2Cgiven_name%2Chd%2Cid%2Clink%2Clocale%2Cname%2Cpicture%2Cverified_email';
        const headers = new Headers({ Authorization: 'Bearer ' + accessToken });
        const options = new RequestOptions({ headers: headers });

        // response Object {id: "114646586003810269060", email: "persuit.happyness602@gmail.com",
        // verified_email: true, name: "Persuit Happyness", given_name: "Persuit"…}
        return this.http.get(peopleApiUrl, options).map(res => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server Error'));
    }

    public authFacebook(token: string): Observable<any> {
        const accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
        const params = {
            code: token,
            client_id: this.authConfig.facebook.clientId,
            client_secret: this.authConfig.facebook.client_secret,
            redirect_uri: this.authConfig.facebook.redirectURI
        };
        const token_request = `code=${token}&client_id=${this.authConfig.facebook.clientId}&client_secret=${this.authConfig.facebook.client_secret}&redirect_uri=${this.authConfig.facebook
            .redirectURI}`;
        // const bodyString = JSON.stringify(params);
        this.logger.log('authFacebook-req', token_request);
        const headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        const options = new RequestOptions({ headers: headers });
        return this.http
            .post(accessTokenUrl, token_request, options)
            .map(res => {
                this.logger.log('authFacebook-resp', res);
                return res.json().access_token;
            })
            .flatMap(access_token => {
                return this.getFacebookProfile(access_token);
            })
            .flatMap(userProfile => {
                return this.loginUserWithFacebook(userProfile.id, userProfile.email, userProfile.name);
            });
        // .catch((error: any) => Observable.throw(error.json().error || 'Server Error'));
    }

    private getFacebookProfile(accessToken: string): Observable<any> {
        const fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name', 'picture.type(large)'];
        const graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
        const headers = new Headers({ Authorization: 'Bearer ' + accessToken });
        const options = new RequestOptions({ headers: headers });

        return this.http
            .get(graphApiUrl, options)
            .map(res => {
                this.logger.log('getFacebookProfile-resp', res);
                return res.json();
            })
            .catch((error: any) => Observable.throw(error.json().error || 'Server Error'));
    }

    public updateUser(user_id: string, mobile: string): Observable<string> {
        const req = {
            number: mobile,
            verified: true
        };
        const bodyString = JSON.stringify(req);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        this.logger.log(bodyString);
        return this.http.post(`${GLOBAL_CONSTANTS.BASE_API_URL}/user/update?id=${user_id}`, bodyString, options).map(res => res.json().message as string).catch(super.handleError);
    }

    public sendOtp(mobile: string): Observable<any> {
        const req = {
            number: mobile
        };
        const bodyString = JSON.stringify(req);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });

        return this.http.post(`${GLOBAL_CONSTANTS.BASE_API_URL}/send/otp`, bodyString, options).map(res => res.json()).catch(err => super.handleError(err));
    }

    public verifyOtp(otp: string, otpId: string): Observable<any> {
        const req = {
            otp: otp,
            id: otpId
        };
        const bodyString = JSON.stringify(req);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });

        return this.http.post(`${GLOBAL_CONSTANTS.BASE_API_URL}/verify/otp`, bodyString, options).map(res => res.json()).catch(err => super.handleError(err));
        /*response.message
      'not matched'
      'expired'
      'matched'
    */
    }
}
