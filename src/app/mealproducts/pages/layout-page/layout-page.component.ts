import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styles: ``
})
export class LayoutPageComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  public name?:string;
  public email?:string;

  ngOnInit(): void {

    const nameEncripted = localStorage.getItem('name') || '';
    const emailEncripted = localStorage.getItem('email') || '';

    const nameUser = this.authService.decrypt(nameEncripted,'name' );
    const emailUser = this.authService.decrypt(emailEncripted,'email' );

    if ( nameUser ) this.name = nameUser;
    if ( emailUser ) this.email = emailUser;

  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);

  }

}
