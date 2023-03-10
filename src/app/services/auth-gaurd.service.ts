import { Injectable } from "@angular/core";
import { CanActivate, Route, Router } from "@angular/router";
import { map, Observable } from "rxjs";
import { AuthStore } from "../store/auth.store";

@Injectable ()
export class AuthGaurdService implements CanActivate {
    constructor(private authStore: AuthStore, private router: Router){

    }

    canActivate(): Observable<boolean> {
        return this.authStore.authData$.pipe(map((data) => {
            if(!data){
               this.router.navigateByUrl('/login');
               return false;
            }
            return true;
        }))
    }
}