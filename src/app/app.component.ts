import { AfterViewInit, Component } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{
  title = 'stock-sim';

  constructor(private authService: AuthService) {}
  
  ngAfterViewInit(){
    this.authService.autoAuthUser();
  }
}
