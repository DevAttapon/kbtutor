import { AuthenticationService } from './../_services/authentication.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor (
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (localStorage.getItem('currentUser')) {
      // logged
      return true;
    }

    // not logged
    this.router.navigate(['/logout']);
    return false;
  }
}
@Injectable({providedIn: 'root' })
export class AuthGuardAdmin implements CanActivate {
  constructor (
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (localStorage.getItem('currentUser') ) {
      if(JSON.parse(localStorage.getItem('currentUser')).status === '1') {
        return true;
      }
    }

    // not logged
    this.router.navigate(['/']);
    return false;
  }
}
