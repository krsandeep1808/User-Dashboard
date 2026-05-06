import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
  standalone: false
})
export class UserFormComponent {
  @Output() readonly submitUser = new EventEmitter<User>();
  @Output() readonly closeModal = new EventEmitter<void>();

  readonly roles: User['role'][] = ['Admin', 'Editor', 'Viewer'];

  readonly form = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    role: ['', Validators.required]
  });

  constructor(private readonly formBuilder: FormBuilder) {}

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.submitUser.emit(this.form.getRawValue() as User);
  }

  close(): void {
    this.closeModal.emit();
  }
}
