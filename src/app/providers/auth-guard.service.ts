import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { GLOBAL_CONSTANTS } from '../global-constants';

import { AuthService } from './index';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.isAuthenticated() === true) {
      return true;
    }

    this.authService.redirectUrl = state.url;
    this.router.navigate(['/signin']);
    // this.router.navigate(['/signin'], { queryParams: { returnUrl: state.url.slice(1) } });
    return false;
  }

}
