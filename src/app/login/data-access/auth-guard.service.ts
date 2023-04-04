import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { map, Observable } from "rxjs";
import { AuthStore } from "./auth.store";

@Injectable ()
export class AuthGuardService implements CanActivate {
    constructor(private authStore: AuthStore, private router: Router){

    }

    canActivate(): Observable<boolean> {
        return this.authStore.authData$.pipe(map((data) => {
            if(!data){
               this.router.navigateByUrl('');
               return false;
            }
            return true;
        }))
    }
}