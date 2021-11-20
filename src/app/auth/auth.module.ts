import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IconComponent } from './login/icon/icon.component';


@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    IconComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FlexLayoutModule
  ]
})
export class AuthModule { }
