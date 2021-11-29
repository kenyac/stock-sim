import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { confirmPasswordValidator } from './confirm-password.directive';

import { Signup } from './signup.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm = new FormGroup({
    email: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    passwordConfirm: new FormControl('', Validators.required)
  }, {validators: confirmPasswordValidator})
  
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  formSubmit() {
    const newUser: Signup = {
      email: this.signupForm.value.email,
      username: this.signupForm.value.username,
      password: this.signupForm.value.password
    };
    console.log(newUser);

    this.authService.createUser(newUser);
  }


}
