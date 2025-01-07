import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../interfaces/user.interface';
import { showAlertError } from '../../../mealproducts/sweetAlerts/alerts';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html'
})
export class LoginPageComponent {

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ){}

  public loginForm: FormGroup = this.fb.group({
    email: ['', [ Validators.required, Validators.email ]],
    password: ['', [ Validators.required, Validators.minLength(6) ]],
  })

  get userForm(): User {
    const user = this.loginForm.value as User;
    return user;
  }

  onLogin(): void {

    const emailControl = this.loginForm.get('email');
    const passwordControl = this.loginForm.get('password');

    if ( emailControl?.invalid ) {
        showAlertError(`Invalid email: ${ emailControl?.value }`);
      return;
    }

    if ( passwordControl?.invalid ) {
      showAlertError(`Invalid password: ${ passwordControl?.value }. Must be longer than 6 characters`);
      return;
    }


    const { email, password } = this.loginForm.value;

    this.authService.login( email, password )
      .subscribe({
        next: () => this.router.navigateByUrl('/meals'),
        error: (message) => {
          showAlertError(message);
        }
      })


  }

}
