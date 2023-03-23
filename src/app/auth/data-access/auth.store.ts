import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, map, Observable } from "rxjs";
import { Auth } from "./auth.model";

const AUTH_DATA = "auth_data";

@Injectable({
  providedIn: "root",
})
export class AuthStore {
  private subject = new BehaviorSubject<Auth | null>(null);
  authData$: Observable<Auth | null> = this.subject.asObservable();

  isAuthorized$: Observable<boolean>;
  isNotAuthorized$: Observable<boolean>;

  constructor(private router: Router) {
    this.isAuthorized$ = this.authData$.pipe(map((auth) => !!auth));

    this.isNotAuthorized$ = this.isAuthorized$.pipe(
      map((authorized) => !authorized)
    );

    const data = localStorage.getItem(AUTH_DATA);

    if(data){
        this.subject.next(JSON.parse(data));
    }
  }

  storeAuth(data: Auth) {
    this.subject.next(data);
    localStorage.setItem(AUTH_DATA, JSON.stringify(data));
  }

  logout() {
    this.subject.next(null);
    localStorage.removeItem(AUTH_DATA);
    this.router.navigateByUrl('')
    
  }
}
