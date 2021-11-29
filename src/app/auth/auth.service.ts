import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalStorage } from './local-storage.model';
import { Signup } from './signup/signup.model';

const BACKEND_URL = environment.apiUrl + '/user';

@Injectable({
  providedIn: 'root'
})


export class AuthService {
  private token!: string;
  private userId!: string; 
  private tokenTimer: any;
  private isAuthenticated: boolean = false;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) { }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  createUser(user: Signup){
    this.http.post(BACKEND_URL + '/signup', user).subscribe(
      () => {
        this.router.navigate(['/auth/login'])
      },
      error => {
        console.log("error");
      }
    )
  }

  login(email: string, password: string) {
    this.http.post<{ token: string, expiresIn: number, userId: string, username: string}>
                (BACKEND_URL + "/login", 
                   { email: email, password: password })
             .subscribe(
               response => {
                  this.token = response.token;
                  if (this.token) {
                    const expiry = response.expiresIn;
                    const expirationDate = Date.now() + expiry;
                    this.setAuthTimer(expiry);
                    this.isAuthenticated = true;
                    this.userId = response.userId;
                    this.authStatusListener.next(true);
                    this.saveAuthData({
                      token: this.token, 
                      expiry: expirationDate, 
                      userId: this.userId
                    })
                    this.router.navigate(["/home"]);
                  }
               }
             );
  }

  logout() {
    this.token = '';
    this.userId = '';
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/auth/login"]);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  autoAuthUser() {
    const authInfo: boolean | LocalStorage = this.getAuthData();
    if (!authInfo){
      return;
    }

    const expiresIn = authInfo.expiry - Date.now();
    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.userId = authInfo.userId;
      this.setAuthTimer(expiresIn);
      this.authStatusListener.next(true);
    }
  }

  private saveAuthData(data: LocalStorage){
    localStorage.setItem("token", data.token);
    localStorage.setItem("expiry", data.expiry.toString());
    localStorage.setItem("userId", data.userId);
  }

  private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiry");
    localStorage.removeItem("userId");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expiry = localStorage.getItem("expiry");
    const userId = localStorage.getItem("userId");
    if (!token || !expiry || !userId) return false;
    return {
      token: token,
      expiry: parseInt(expiry),
      userId: userId
    }
  }

}
