import { Employees } from './employees';
export class DeptSelection {
  private _select: boolean;
  private _dept: string;

  constructor(select: boolean, dept: string) {
    this._select = select;
    this._dept = dept;
  }
  public set select(select: boolean) {
    this._select = select;
  }
  public get select(): boolean {
    return this._select;
  }

  public set dept(dept: string) {
    this._dept = dept;
  }
  public get dept(): string {
    return this._dept;
  }

  shouldInclude(employee: Employees): boolean {
    if (!this.select) {
      return true;
    }
    if (this.dept.match(employee.project_name)) {
      return true;
    }
    return false;
  }

}
