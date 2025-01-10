// branch-cookie.service.ts
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
// import { BranchEntity } from 'src/app/structure/branch/models/branch.model';

export interface BranchEntity {
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


@Injectable({
  providedIn: 'root'
})
export class BranchCookieService {
  constructor(private cookieService: CookieService) {}

  ttl: number = 86400 * 1000; // 86400 = 24 horas
  futureDate: any = new Date((new Date()).getTime() + this.ttl); //añade expiracion de 1 día
  
  saveBranch(branch: BranchEntity): void {
    const branchAsString = JSON.stringify(branch);
    this.cookieService.set('branch', branchAsString,{ path: '/', expires: this.futureDate}); // Guardar como cookie
  }

  getBranch(): BranchEntity | null {
    const branchAsString = this.cookieService.get('branch');
    return branchAsString ? JSON.parse(branchAsString) : null;
  }

  deleteBranch(): void {
    this.cookieService.delete('branch', '/');
  }

}
