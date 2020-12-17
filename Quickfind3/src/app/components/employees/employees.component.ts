import { ApiService } from '../../service/api.service';
import { Employees } from './../../models/employees';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatChipInputEvent, MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, first } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/service/user.service';
import { AuthService } from 'src/app/service/auth.service';
import { DeptSelection } from 'src/app/models/deptSelection';


@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class EmployeesComponent implements OnInit {
  search_string = '';
  filteredData = [];
  filteredList = [];
  spresp: any = [];
  postdata: Employees;
  employeesData: Employees[] = [];
  columnsToDisplay = ['avatar', 'employee_nr_dk', 'first_name', 'last_name', 'project_name'
    ,  'email', 'mobile_nr', 'ifs_category'];
  expandedElement: Employees | null;
  dataSource = new MatTableDataSource<Employees>(this.employeesData);


// add skill
visible = true;
selectable = true;
removable = true;
addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  // skill autocomplete
  skillCtrl = new FormControl;

  // login
  currentUser: User;
  userFromApi: User;

  departmentSelection: DeptSelection;


  @ViewChild('skillInput') skillInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutoComplete: MatAutocomplete;

  constructor(
    private api: ApiService,
    private router: Router,
    private userService: UserService,
    private authenticationService: AuthService
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
    this.getDepartmentSelections();


  }

  getEmployeesDatas() {
    console.log('this.getEmployeesDatas()');
    this.api.getEmployeesData()
      .subscribe(data => {
        const mySearch = this.search_string.toLowerCase();
        this.filteredData = [];
        for (const employee of data) {
          const include = this.departmentSelection === undefined || this.departmentSelection.shouldInclude(employee);
          if (include && employee.convertToString().match(mySearch) && !employee.removed) {
            this.filteredData.push(employee);
          }
        }
        this.dataSource = new MatTableDataSource<Employees>(this.filteredData);
      });
  }

  onDepartmentSelectionChanged(departmentSelection: DeptSelection): void {
    console.log('onDepartmentSelcetionChanged()');
    this.departmentSelection = departmentSelection;
    this.getEmployeesDatas();
  }

  getDepartmentSelections() {
    this.api.getDepartmentSelection()
      .subscribe(deptSelection => this.onDepartmentSelectionChanged(deptSelection));
  }

  addEmployeesData() {
    const json = {
    };
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
      });
  }

  deleteEmployeesData(id: any, employeesData: Employees) {
    this.api.deleteEmployeesData(id, employeesData)
      .subscribe(resp => {
        return this.spresp.push(resp);
      });
  }

  search() {
    this.getEmployeesDatas();
  }

  // Chiplist
  addSkill(event: MatChipInputEvent, data: Employees): void {
    const input = event.input;
    const value = event.value;


    // Add our Skill
      if ((value || '').trim()) {
        data.skill_name.push(value.trim());
        this.updateEmployeesData(data.id, data);
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }
    this.skillCtrl.setValue(null);
  }

  removeSkill(data: Employees, skill: string): void {
    const index = data.skill_name.indexOf(skill);

    if (index >= 0) {
      data.skill_name.splice(index, 1);
    }
    this.updateEmployeesData(data.id, data);
  }

  selected(event: MatAutocompleteSelectedEvent, data: Employees): void {
    data.skill_name.push(event.option.viewValue);
    this.skillInput.nativeElement.value = '';
    this.skillCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.postdata.skill_name.filter(skill => skill.toLowerCase().indexOf(filterValue) === 0);
  }


}
