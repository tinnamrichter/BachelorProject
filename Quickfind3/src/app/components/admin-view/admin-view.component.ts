import { AuthService } from 'src/app/service/auth.service';
import { DeptSelection } from 'src/app/models/deptSelection';
import { UserService } from './../../service/user.service';
import { catchError, map, first } from 'rxjs/internal/operators';
import { HttpClient, HttpEventType, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { Employees } from './../../models/employees';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable, of } from 'rxjs';
import { User } from 'src/app/models/user';
import { Role } from 'src/app/models/role';



@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AdminViewComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload: ElementRef; files = [];
  search_string = '';
  filteredData = [];
  filteredList = [];
  spresp: any;
  postdata: Employees;
  employeesData: Employees[] = [];
  columnsToDisplay = ['avatar', 'employee_nr_dk', 'first_name', 'last_name', 'project', 'project_name'
    , 'email', 'mobile_nr', 'ifs_category'];
  expandedElement: Employees | null;
  dataSource = new MatTableDataSource<Employees>(this.employeesData);
  // file upload
  fileToUpload: File = null;

  // User login
  users: User[] = [];
  currentUser: User;

  departmentSelection: DeptSelection;

  constructor(
    private api: ApiService,
    private router: Router,
    private userService: UserService,
    private authenticationService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.getEmployeesDatas();
    this.getDepartmentSelections();
    this.userService.getAll().pipe(first()).subscribe(users => {
      this.users = users;
    });
  }

  getEmployeesDatas() {
    this.api.getEmployeesData()
      .subscribe(data => {
        this.filteredData = [];
        for (const employee of data) {
          const include = this.departmentSelection === undefined || this.departmentSelection.shouldInclude(employee);
          if (include && employee.convertToString().match(this.search_string) && !employee.removed) {
            this.filteredData.push(employee);
          }
        }

        this.dataSource = new MatTableDataSource<Employees>(this.filteredData);
      });
  }

  onDepartmentSelectionChanged(departmentSelection: DeptSelection): void {
    this.departmentSelection = departmentSelection;
    this.getEmployeesDatas();
  }

  getDepartmentSelections() {
    this.api.getDepartmentSelection()
      .subscribe(deptSelection => this.onDepartmentSelectionChanged(deptSelection));
  }


  addEmployeesData() {
    const json = {};
    this.api.addEmployeesData(new Employees(json))
      .subscribe(resp => {
        return this.spresp.push(resp);
      });
  }

  updateEmployeesData(id: number, data: Employees) {
    this.api.updateEmployeesData(id, data)
      .subscribe(resp => {
        for (let i = 0; i < this.spresp.length; i++) {
          const element = this.spresp[i];
          if (element.id === resp.id) {
            this.spresp[i] = resp;
          }
        }
        this.getEmployeesDatas();
      });
  }

  deleteEmployeesData(id: any, employeesData: Employees) {
    this.api.deleteEmployeesData(id, employeesData)
      .subscribe(resp => {
        return this.spresp.push(resp);
      });
  }

  save(data: Employees) {
    this.updateEmployeesData(data.id, data);

  }

  search() {
    this.getEmployeesDatas();
  }

  addANewEmployee(data: Employees) {
    this.api.employees.subscribe(() => {
      this.employeesData.push(<Employees>{
      });
      this.addEmployeesData();
      this.getEmployeesDatas();
      this.save(data);
    });
  }


  removeEmployee(data: Employees) {
    this.api.employees.subscribe(() => {
      data.removed = true;
      this.updateEmployeesData(data.id, data);
      this.getEmployeesDatas();
    });
  }

  // Upload File

  uploadFile(file) {
    const formData = new FormData();
    formData.append('photo', file.data.photo);
    file.inProgress = true;
    this.api.upload(formData).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            file.progress = Math.round(event.loaded * 100 / event.total);
            break;
          case HttpEventType.Response:
            return event;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        file.inProgress = false;
        return of(`${file.data.photo} upload failed.`);
      })).subscribe((event: any) => {
        if (typeof (event) === 'object') {
          console.log(event.body);
        }
      });
  }


  onClick(data: Employees) {
    const fileUpload = this.fileUpload.nativeElement; fileUpload.onchange = () => {
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        this.files.push({ data: file, inProgress: false, progress: 0 });
        data.photo = 'images/' + file.name;
      }
      this.updateEmployeesData(data.id, data);
    };
     fileUpload.click();


  }

  get isAdmin() {
    return this.currentUser && this.currentUser.role === Role.Admin;
  }
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/employees']);
  }


}
