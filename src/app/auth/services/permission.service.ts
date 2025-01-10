import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
// import { ApiService } from './api.service';
// import { PermissionEntity } from 'src/app/structure/config/permissions/models/permission.model';
// import { BranchCookieService } from './branch-cookie.service';
import { BranchCookieService } from './branch-cookie.service';
import { QueryFilter } from '../interfaces/queryfilter.interface';
// import { QueryFilter } from '../interfaces/queryfilter.interface';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';
// import { AuthService } from 'src/app/services/auth/auth.service';
import { AuthService } from './auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

class PermissionEntity {
    branchId: number = 0;
    userId: number = 0;
    accessId: number = 0;
    identifier: number = 0;
    parent_identifier: number = 0;
    view: boolean = false;
    create: boolean = false;
    edit: boolean = false;
    delete: boolean = false;
    post: boolean = false;
    download: boolean = false;
}

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  userId: number = 0;
  branchId: number = 0;
  public permissions: PermissionEntity[] | any = [];

  constructor(
    private readonly apiService: ApiService<PermissionEntity>,
    private branchCookieService: BranchCookieService,
    private cookieService: CookieService,
    private authService: AuthService,
    private router: Router
  ) {}

  async getUser(): Promise<any>{
    const userMetadata = await this.cookieService.get('userMetadata');
    if(userMetadata && userMetadata !== '' && userMetadata !== undefined && userMetadata !== null){
      try {
        this.userId =  await this.authService.decryptUserMetadata(userMetadata)?.booksUserId;
        return this.userId;
      } catch (error) {
        const err = error as HttpErrorResponse;
        Swal.fire({
          title: 'Error',
          text: err.error.message,
          icon: 'error'
        });
      }
    } else console.warn('No user metadata found in cookies');
  }
  
  // Valida que la branch exista y sea valida
  async validateBranch(){
    try {
      this.branchId = Number(await this.branchCookieService.getBranch()?.id);
      const queryFilter: QueryFilter = {
        where: { and: [{ id: { equals: this.branchId } }]}
      };
      const response = await this.apiService.findAll('branch', queryFilter).toPromise();
      if(response.data.length <= 0){
        this.authService.logout();
      }
    } catch (error) {
      console.error('Error: ', error);
    }
  }

  //Obtiene todos los permisos del usuario
  async getPermission(branchId: number): Promise<any>{
    try {
      const queryFilter: QueryFilter = {
        fields: ['accessId', 'identifier', 'access.module', 'access.parentIdentifier', 'access.route', 'view', 'create', 'edit', 'delete', 'post', 'download'],
        skip: 0,
        limit: 0,
        where: { and: [ { branchId: { equals: branchId } }, { userId: { equals: this.userId } } ] },
        leftJoin: ['access'],
        orderBy: { identifier: 'ASC' }
      };

      const response = await this.apiService.findAll('access-users', queryFilter).toPromise();
      if(response && response.data ) this.permissions = response.data;
      return this.permissions;

    } catch (error) {
      const err = error as HttpErrorResponse;
      Swal.fire({
        title: 'Error',
        text: err.error.message,
        icon: 'error'
      });
    }
  }

  //Busca el permiso al modulo solicitado en los permisos del usuario
  async validatePermission(module: number){
    try {
      if(this.permissions.length <= 0){
        await this.validateBranch();
        await this.getUser();
        await this.getPermission(this.branchId);
      }

      let permission;
      if(module >= 0){
        permission = this.permissions
        .filter((permission: any) => permission.access !== null) // Filter out null access
        .find((permission: any) => permission.identifier === module); // Apply the find
      }

      return permission ?? new PermissionEntity();
    } catch (error) {
      const err = error as HttpErrorResponse;
      Swal.fire({
        title: 'Error',
        text: err.error.message,
        icon: 'error'
      });
      return new PermissionEntity();
    }
  }

  async reloadPermissions(userId: number){
    if(userId === this.userId){ // Recarga los permisos solo sí es el mismo usuario logueado
      this.getPermission(this.branchId);
    } else { // Sí es usuario diferente, solicita que se cierre su sesión
      try {
        const response = await this.apiService.callPostApi(`auth/${userId}/user-logout`, undefined, undefined)
      } catch (error) {
        const err = error as HttpErrorResponse;
        console.error(error);
        Swal.fire({
          title: 'Error',
          text: err.error.message,
          icon: 'error'
        });
      }
    }
  }

  async getMenuOptions(identifier: number){
    const queryFilter: QueryFilter = {
      view: { name: 'menu-options' }
    }
    const menuOptions =  await this.apiService.findAll('access-users', queryFilter).toPromise();
    const module = menuOptions.filter((menu: any) => menu.identifier === identifier);
    return module[0]?.label ?? '';
  }

  async redirectUrl(){

    const validaPermissions = (permissions: any[]) => {
      return permissions.filter((p: any) => {
        // Si no tiene parentIdentifier o su parent tiene view === true, es válido
        if (!p.access?.parentIdentifier) {
          return p.view === true;
        }
    
        // Busca el parent correspondiente
        const parent = permissions.find((parent: any) => parent.identifier === p.access.parentIdentifier);
    
        // Verifica que el parent exista y tenga view === true
        return p.view === true && parent?.view === true;
      });
    };

    const permissions = validaPermissions(this.permissions).filter( (p:any) => p.access?.parentIdentifier !== null);
    
    //Sí permissions está vacío, significa que no tiene permiso y cierra la sesion
    if(permissions.length <= 0){
      Swal.fire({
        title: 'Error',
        text: 'Yo do not have permission to access.',
        icon: 'error'
      });
      this.authService.logout();
      return;
    }
    
    const url = permissions[0]?.access?.route;
    this.router.navigateByUrl(url);

  }

  async hasAnyPermission(branches: any){
    await this.getUser();
    
    for(let i = 0; i < branches.length; i++){
      const branch = branches[i];
      await this.getPermission(branch.id);
      if(this.permissions.length > 0){
        const permissions = this.permissions.filter( (p: any) => p.view == true );
        if(permissions.length > 0){
          return branch;
        }
      }
    }
    Swal.fire({
      title: 'Error',
      text: 'You do not have permission to access.',
      icon: 'error'
    });
    this.authService.logout();
    return null;
  }
}
