import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";

@Injectable ()
export class AuthGaurdService implements CanActivate {
    canActivate(): boolean {
        if(localStorage.getItem('auth_data')){
            return true;
        }
        return false
    }
}