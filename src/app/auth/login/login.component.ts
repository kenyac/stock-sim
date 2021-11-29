import { ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  
  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  
  constructor(private authService: AuthService) { }


  ngOnInit(): void {
  }

  formSubmit(){
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password);
  }


}
