import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ComponentRef,
  DestroyRef,
  ElementRef,
  EnvironmentInjector,
  NgModuleRef,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
  createNgModule,
  inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import type { UserFormComponent } from '../user-form/user-form.component';
import type { UserFormModule } from '../user-form/user-form.module';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('modalHost', { read: ViewContainerRef }) modalHost!: ViewContainerRef;

  private readonly userService = inject(UserService);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly destroyRef = inject(DestroyRef);

  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm = '';

  currentPage = 1;
  readonly pageSize = 5;

  private chart?: Chart;
  private chartModuleLoaded = false;
  private formRef?: ComponentRef<UserFormComponent>;
  private formModuleRef?: NgModuleRef<UserFormModule>;

  ngAfterViewInit(): void {
    this.initializeChart();
    this.userService.users$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((users) => {
      this.users = users;
      this.applyFilter();
      this.updateChart();
    });
  }

  get totalPages(): number {
    return Math.max(Math.ceil(this.filteredUsers.length / this.pageSize), 1);
  }

  get paginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  async openAddUserModal(): Promise<void> {
    if (this.formRef) {
      return;
    }

    const formChunk = await import('../user-form/user-form.module');
    this.formModuleRef = createNgModule<UserFormModule>(formChunk.UserFormModule, this.environmentInjector);
    this.formRef = this.modalHost.createComponent(formChunk.UserFormComponent, {
      environmentInjector: this.formModuleRef.injector
    });

    this.formRef.instance.submitUser.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((user) => {
      this.userService.addUser(user);
      this.closeAddUserModal();
    });

    this.formRef.instance.closeModal.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.closeAddUserModal();
    });
  }

  closeAddUserModal(): void {
    this.formRef?.destroy();
    this.formRef = undefined;
    this.formModuleRef?.destroy();
    this.formModuleRef = undefined;
    this.modalHost?.clear();
  }

  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredUsers = this.users.filter((user) => {
      if (!term) {
        return true;
      }
      return (
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term)
      );
    });
    this.currentPage = 1;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage += 1;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
    }
  }

  private async initializeChart(): Promise<void> {
    const chartJs = await import('chart.js');
    chartJs.Chart.register(
      chartJs.PieController,
      chartJs.ArcElement,
      chartJs.Tooltip,
      chartJs.Legend
    );
    this.chartModuleLoaded = true;

    this.chart = new chartJs.Chart(this.chartCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Admin', 'Editor', 'Viewer'],
        datasets: [
          {
            data: [0, 0, 0],
            backgroundColor: ['#1c4980', '#383838', '#6f7783'],
            borderWidth: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });

    this.updateChart();
  }

  private updateChart(): void {
    if (!this.chart || !this.chartModuleLoaded) {
      return;
    }
    const counts = {
      Admin: 0,
      Editor: 0,
      Viewer: 0
    };
    this.users.forEach((user) => {
      counts[user.role] += 1;
    });
    this.chart.data.datasets[0].data = [counts.Admin, counts.Editor, counts.Viewer];
    this.chart.update();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
    this.closeAddUserModal();
  }
}
