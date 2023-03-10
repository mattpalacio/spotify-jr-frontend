import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { Auth } from "../model/auth.model";

const AUTH_DATA = "auth_data";

@Injectable({
  providedIn: "root",
})
export class AuthStore {
  private subject = new BehaviorSubject<Auth | null>(null);
  authData$: Observable<Auth | null> = this.subject.asObservable();

  isAuthorized$: Observable<boolean>;
  isNotAuthorized$: Observable<boolean>;

  constructor() {
    this.isAuthorized$ = this.authData$.pipe(map((auth) => !!auth));

    this.isNotAuthorized$ = this.isAuthorized$.pipe(
      map((authorized) => !authorized)
    );
  }

  storeAuth(data: Auth) {
    this.subject.next(data);
    localStorage.setItem(AUTH_DATA, JSON.stringify(data));
  }

  logout() {
    this.subject.next(null);
    localStorage.removeItem(AUTH_DATA);
  }
}
