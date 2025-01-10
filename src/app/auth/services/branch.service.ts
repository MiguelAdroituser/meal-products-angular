import { BehaviorSubject } from "rxjs";
import { BranchCookieService } from "./branch-cookie.service";
// import { BranchEntity } from "src/app/structure/branch/models/branch.model";
import { Injectable } from "@angular/core";

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

@Injectable({
    providedIn: 'root'
})
// This service manages the current branch information using BehaviorSubject and cookies.
export class BranchService {
    // BehaviorSubject to hold the current branch information. Initially, it's set to null.
    private currentBranchSubject = new BehaviorSubject<BranchEntity | null>(null);
    
    // Observable to allow other components to subscribe and get updates on the current branch.
    currentBranch$ = this.currentBranchSubject.asObservable();
  
    // Constructor to inject BranchCookieService and load the initial branch information.
    constructor(private branchCookie: BranchCookieService) {
      this.loadInitialBranch();
    }
  
    // Method to load the initial branch information from cookies.
    loadInitialBranch() {
      const branch = this.branchCookie.getBranch();
      if (branch) {
        this.currentBranchSubject.next(branch); // Update the BehaviorSubject with the branch information if available.
      }
    }
  
    // Method to change the current branch and update both the cookies and BehaviorSubject.
    changeBranch(branch: BranchEntity) {
      this.branchCookie.saveBranch(branch); // Save the new branch information in cookies.
      this.currentBranchSubject.next(branch); // Update the BehaviorSubject with the new branch information.
    }
}