import { AuthService } from './service/auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatTableModule,
  MatInputModule,
  MatFormFieldModule,
  MatSidenavModule,
  MatCardModule,
  MatChipsModule,
  MatIconModule,
  MatAutocompleteModule,
  MatProgressBarModule,
  MatListModule,
  MatButtonModule,
} from '@angular/material';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminViewComponent } from './components/admin-view/admin-view.component';
import { LoginComponent } from './components/login/login.component';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { fakeBackendProvider } from './helpers/fake-backend';
import { AuthGuardService } from './service/auth-guard.service';
import { Role } from './models/role';

@NgModule({
  declarations: [
    AppComponent,
    EmployeesComponent,
    AdminViewComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatTableModule,
    HttpClientModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatInputModule,
    MatListModule,
    MatButtonModule,


        // Routing
        RouterModule.forRoot([
          { path: 'employees', component: EmployeesComponent },
          { path: 'admin', component: AdminViewComponent, canActivate: [AuthGuardService], data: { roles: [Role.Admin] } },
          { path: 'login', component: LoginComponent },
          { path: '**', redirectTo: 'employees'},
        ]),
  ],
  providers: [
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true
    },
    fakeBackendProvider

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
