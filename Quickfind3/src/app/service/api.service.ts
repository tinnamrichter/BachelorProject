import { Employees } from '../models/employees';

import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, retry, map } from 'rxjs/internal/operators';
import { DeptSelection } from '../models/deptSelection';

//const employeesDataUrl = '/databaseQuickfind/readdb.php/';
 const employeesDataUrl = 'http://localhost:3000/employeesData/';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'jwt-token'
  })
};

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  SERVER_URL: string = employeesDataUrl;
  departmentSelection: DeptSelection;
  private notifier = new Subject<DeptSelection>();

  private _employees: BehaviorSubject<Employees[]> = new BehaviorSubject([]);

  public employees: Observable<Employees[]> = this._employees.asObservable();

  constructor(private http: HttpClient) {
   }

  getEmployeesData(): Observable<Employees[]> {
    httpOptions.headers = httpOptions.headers.set('Authorization', 'my-new-auth-token');
    return this.http.get<Employees[]>(employeesDataUrl, httpOptions)
      .pipe(
        map((response: Employees[]) => {
          const searchData = [];
          for (const employeeObj of response) {

              searchData.push(new Employees(employeeObj));
          }

          return searchData;
        }),
      retry(3), catchError(this.handleError<Employees[]>('getEmployeesData', [])));
  }

  addEmployeesData(employeesData: Employees): Observable<Employees> {
    return this.http.post<Employees>(employeesDataUrl, {
      skill_name: [],
      removed: false,
      photo: 'images/placeholder.png'
    }, httpOptions)
      .pipe(
        catchError(this.handleError('addEmployeesData', employeesData))
      );
  }


  updateEmployeesData(id: any, employeesData: Employees): Observable<Employees> {
    return this.http.put<Employees>(employeesDataUrl + id, {
      id: employeesData.id,
      photo: employeesData.photo,
      employee_nr_dk: employeesData.employee_nr_dk,
      userid: employeesData.userid,
      corp_id: employeesData.corp_id,
      first_name: employeesData.first_name,
      last_name: employeesData.last_name,
      initials: employeesData.initials,
      project: employeesData.project,
      project_name: employeesData.project_name,
      work_ordre: employeesData.work_ordre,
      email: employeesData.email,
      mobile_nr: employeesData.mobile_nr,
      leader: employeesData.leader,
      employee_nr: employeesData.employee_nr,
      org_id_acf: employeesData.org_id_acf,
      ifs_category: employeesData.ifs_category,
      removed: employeesData.removed,
      skill_name: employeesData.skill_name
    }, httpOptions)
      .pipe(
        catchError(this.handleError('addEmployeesData', employeesData))
      );
  }

  deleteEmployeesData(id: any, employeesData: Employees): Observable<Employees> {
    return this.http.delete<Employees>(employeesDataUrl + id, httpOptions)
      .pipe(
        catchError(this.handleError('addEmployeesData', employeesData))
      );
  }

  // File Upload
  public upload(formData) {
    return this.http.post<any>(this.SERVER_URL, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  // Filter employees by Department

  setDepartment(department: string | undefined) {
    console.log('setDepartment()');
    const selected = department !== undefined;
    const dept = selected ? department : '';
    this.departmentSelection = new DeptSelection(selected, dept);
    this.notifier.next(this.departmentSelection);
  }

  getDepartmentSelection(): Observable<DeptSelection> {
    return this.notifier;
  }

// handle error
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(message);
  }
}
