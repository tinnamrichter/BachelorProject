import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';

const apiUrl = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<User[]>(`${apiUrl}/users`);
  }

  getById(id: number) {
    return this.http.get<User>(`${apiUrl}/users/${id}`);
  }
}
