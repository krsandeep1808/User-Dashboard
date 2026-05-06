import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly usersSubject = new BehaviorSubject<User[]>([
    {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      role: 'Admin'
    },
    {
      name: 'Bob Miller',
      email: 'bob@example.com',
      role: 'Editor'
    },
    {
      name: 'Clara Smith',
      email: 'clara@example.com',
      role: 'Viewer'
    }
  ]);

  readonly users$ = this.usersSubject.asObservable();

  addUser(user: User): void {
    const currentUsers = this.usersSubject.value;
    this.usersSubject.next([...currentUsers, user]);
  }
}
