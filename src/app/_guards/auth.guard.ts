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

    const currentUser = this.authenticationService;
    if (currentUser) {
      // logged
      return true;
    }

    // not logged
    this.router.navigate(['/logout'], {queryParams: { reuturnUrl: state.url}});
    return false;
  }
}
