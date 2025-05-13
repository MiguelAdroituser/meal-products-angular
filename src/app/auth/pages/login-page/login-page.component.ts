import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../interfaces/user.interface';
import { showAlertError } from '../../../mealproducts/sweetAlerts/alerts';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
// import { PermissionService } from '../../services/permission.service';
import { QueryFilter } from '../../interfaces/queryfilter.interface';
import { ApiService } from '../../services/api.service';
import { BranchCookieService } from '../../services/branch-cookie.service';
import { BranchService } from '../../services/branch.service';
import { WebSocketService } from '../../services/web-socket.service';

interface BranchEntity {
  id: number;
  name: string;
  nickname?: string;  // El signo de interrogación indica que esta propiedad es opcional
  color: string;
  timezone: string;
  isActive: boolean;
  currency:string;
  startFinancialYear:Date;
  imageUrl:string
  address:string;
  taxNumber:string;
  crmId:string;
  costType:string;
  legalName:string
  city:string;
  province:string;
  postalCode:string;
  country:string;
  phoneFax:string;
  companyEmail:string;
  website:string;
  typeBussinessEntity:string;
  industry:string;
  createdAt?: string;
}


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html'
})
export class LoginPageComponent {
  showError = false;
  submitted = false;
  errorMessage: string = '';
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private webSocketService: WebSocketService,
    // private permissionService: PermissionService,
    private apiService: ApiService<BranchEntity>,
    private branchService: BranchService
  ){
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  /* public loginForm: FormGroup = this.fb.group({
    email: ['', [ Validators.required, Validators.email ]],
    password: ['', [ Validators.required, Validators.minLength(6) ]],
  }) */

  get userForm(): User {
    const user = this.loginForm.value as User;
    return user;
  }

  get form() {
    return {
      ...this.loginForm.value
    }
  }

  /* este onlogin se utiliza para github actions. donde simula el login para books, crm */
  /* async onLogin() {

    this.submitted = true;

    // Verify if the login form is valid
    if (this.loginForm.valid) {
      try {
        // this.loadingService.showLoading();
        // Attempt to login with the provided email and password
        await this.authService.login(this.form?.email, this.form?.password);
        this.permissionService.permissions = [];

        const queryFilter: QueryFilter = {
          skip: 0,
          limit: 0,
          where: {
            "and": [{ isActive: { equals: true } }]
          },
          orderBy: { "id": "ASC" }
          // Añade orderBy, leftJoin, innerJoin si son necesarios
        };
        this.apiService.findAll('branch', queryFilter).subscribe(async res => {
          if (res.data.length > 0) {
            const branch = await this.permissionService.hasAnyPermission(res.data);
            this.branchService.changeBranch(branch);
            
            // If successful, navigate to the homepage and reload the page to reflect changes
            this.permissionService.redirectUrl();
            // this.router.navigate(['/dashboard']).then(() => {
            //   // window.location.reload();
            // });
          }
        });
        const { email, rememberMe } = this.loginForm.value;
        if(rememberMe){
          localStorage.setItem('email', email);
          localStorage.setItem('rememberMe', rememberMe);
        } else {
          localStorage.removeItem('email');
          localStorage.removeItem('rememberMe');
        }
      } catch (error: any) {
        console.error('Login error:', error);

        // Check the type of error based on the statusText property
        if (error?.status === 500) {
          this.errorMessage = 'Server error!';
        } else if (error?.status === 401) {
          this.errorMessage = 'Invalid credentials!';
        } else if (error?.status === 403) {
          this.errorMessage = 'Access denied. You do not have permission to access this resource.';
        } else {
          // Handle generic or unknown errors
          this.errorMessage = 'Unknown login error. Please try again later.';
        }



        // Display the error toast
        this.showError = true;
        // Hide the error toast after 3 seconds
        setTimeout(() => this.showError = false, 3000);
      }
      finally {
        // this.loadingService.hideLoading();
      }
    }


  } */
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
