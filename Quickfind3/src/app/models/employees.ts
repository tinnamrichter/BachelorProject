import { ConvertToString } from './toString';

export class Employees implements ConvertToString {
  private _id: number;
  private _photo: string;
  private _employee_nr_dk: number;
  private _userid: string;
  private _corp_id: string;
  private _first_name: string;
  private _last_name: string;
  private _initials: string;
  private _project: number;
  private _project_name: string;
  private _work_ordre: number;
  private _email: string;
  private _mobile_nr: string;
  private _leader: string;
  private _employee_nr: number;
  private _org_id_acf: string;
  private _ifs_category: string;
  private _removed: boolean;
  private _skill_name: string[];

  constructor(json) {
    this._id = json.id;
    this._photo = json.photo;
    this._employee_nr_dk = json.employee_nr_dk;
    this._userid = json.userid;
    this._corp_id = json.corp_id;
    this._first_name = json.first_name;
    this._last_name = json.last_name;
    this._initials = json.initials;
    this._project = json.project;
    this._project_name = json.project_name;
    this._work_ordre = json.work_ordre;
    this._email = json.email;
    this._mobile_nr = json.mobile_nr;
    this._leader = json.leader;
    this._employee_nr = json.employee_nr;
    this._org_id_acf = json.org_id_acf;
    this._ifs_category = json.ifs_category;
    this._removed = json.removed;
    this._skill_name = json.skill_name;
  }

  public convertToString(): string {
    const str = this.photo + ' ' + this.employee_nr_dk + ' ' + this.userid
      + ' ' + this.corp_id + ' ' + this.first_name + ' ' + this.last_name + ' ' + this.initials + ' '
      + this.project + ' ' + this.project_name + ' ' + this.work_ordre + ' ' + this.email + ' '
      + this.mobile_nr + ' ' + this.leader + ' ' + this.employee_nr + ' ' + this.org_id_acf + ' '
      + this.ifs_category + ' ' + this.skill_name;
    return str.toLowerCase();
  }

  public set id(id: number) {
    this._id = id;
  }
  public get id(): number {
    return this._id;
  }

  public set photo(photo: string) {
    this._photo = photo;
  }
  public get photo(): string {
    return this._photo;
  }

  public set employee_nr_dk(employee_nr_dk: number) {
    this._employee_nr_dk = employee_nr_dk;
  }
  public get employee_nr_dk(): number {
    return this._employee_nr_dk;
  }

  public set userid(userid: string) {
    this._userid = userid;
  }
  public get userid(): string {
    return this._userid;
  }

  public set corp_id(corp_id: string) {
    this._corp_id = corp_id;
  }
  public get corp_id(): string {
    return this._corp_id;
  }

  public set first_name(first_name: string) {
    this._first_name = first_name;
  }
  public get first_name(): string {
    return this._first_name;
  }

  public set initials(initials: string) {
    this._initials = initials;
  }
  public get initials(): string {
    return this._initials;
  }

  public set last_name(last_name: string) {
    this._last_name = last_name;
  }
  public get last_name(): string {
    return this._last_name;
  }

  public set project(project: number) {
    this._project = project;
  }
  public get project(): number {
    return this._project;
  }

  public set project_name(project_name: string) {
    this._project_name = project_name;
  }
  public get project_name(): string {
    return this._project_name;
  }

  public set work_ordre(work_ordre: number) {
    this._work_ordre = work_ordre;
  }
  public get work_ordre(): number {
    return this._work_ordre;
  }

  public set email(email: string) {
    this._email = email;
  }
  public get email(): string {
    return this._email;
  }

  public set mobile_nr(mobile_nr: string) {
    this._mobile_nr = mobile_nr;
  }
  public get mobile_nr(): string {
    return this._mobile_nr;
  }

  public set leader(leader: string) {
    this._leader = leader;
  }
  public get leader(): string {
    return this._leader;
  }

  public set employee_nr(employee_nr: number) {
    this._employee_nr = employee_nr;
  }
  public get employee_nr(): number {
    return this._employee_nr;
  }

  public set org_id_acf(org_id_acf: string) {
    this._org_id_acf = org_id_acf;
  }
  public get org_id_acf(): string {
    return this._org_id_acf;
  }

  public set ifs_category(ifs_category: string) {
    this._ifs_category = ifs_category;
  }
  public get ifs_category(): string {
    return this._ifs_category;
  }

  public set removed(removed: boolean) {
    this._removed = removed;
  }
  public get removed(): boolean {
    return this._removed;
  }

  public set skill_name(skill_name: string[]) {
    this._skill_name = skill_name;
  }
  public get skill_name(): string[] {
    return this._skill_name;
  }

}
