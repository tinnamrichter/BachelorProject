import { Employees } from './models/employees';
import { AuthService } from './service/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from './models/user';
import { Router } from '@angular/router';
import { Role } from './models/role';
import { ApiService } from './service/api.service';
import { MatTableDataSource, MatSelectionList, MatListOption } from '@angular/material';
import * as _ from 'lodash';
import { SelectionModel } from '@angular/cdk/collections';
import { UserService } from './service/user.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'quickfind';
  allLinks: Employees[] = [];
  search_string = '';
  filteredData = [];
  filteredList = [];
  employeesData: Employees[] = [];
  dataSource = new MatTableDataSource<Employees>(this.employeesData);
  spresp: any = [];
  @ViewChild(MatSelectionList)
  private selectionList: MatSelectionList;

  selectedDepartment: string | undefined;

  currentUser: User;
  userFromApi: User;


  constructor(
    private router: Router,
    private authenticationService: AuthService,
    private api: ApiService,
    private userService: UserService,
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
    if (this.currentUser !== null) {
      console.log('current user: ' + this.currentUser);
      this.userService.getById(this.currentUser.id).pipe(first()).subscribe(user => {
        this.userFromApi = user;
      });
    }
  }

  ngOnInit(): void {
    this.getEmployeesDatas();
    this.selectionList.selectedOptions = new SelectionModel<MatListOption>(false);
  }

  get isAdmin() {
    return this.currentUser && this.currentUser.role === Role.Admin;
  }

  getEmployeesDatas() {
    this.api.getEmployeesData()
      .subscribe(data => {
        const tempLinks = new Array();
        for (const employeeLink of data) {
          if (employeeLink.project_name) {
            tempLinks.push(employeeLink.project_name);

          }
          this.allLinks = Array.from(new Set(tempLinks));

        }
      });
  }


  selectDepartment(mouseEvent: any , link: string | undefined) {
    this.api.setDepartment(link);

  }




}
