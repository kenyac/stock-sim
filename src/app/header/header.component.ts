import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  authStatus$!: Observable<boolean>;
  
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authStatus$ = this.authService.getAuthStatusListener();
  }

  logout() {
    this.authService.logout();
  }

}
