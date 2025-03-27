import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersWithoutManagersComponent } from './users-without-managers/users-without-managers.component';
import { RouteGuardService } from 'qbm';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { EuiCoreModule } from '@elemental-ui/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';
import { DataSourceToolbarModule, DataTableModule, CdrModule } from 'qbm';
import { OrgChartModule } from '../org-chart/org-chart.module';
import { UsersByDepartmentsComponent } from './users-by-departments/users-by-departments.component';
import { UsersByManagersComponent } from './users-by-managers/users-by-managers.component';

const routes: Routes = [
  {
    path: 'users-without-managers',
    component: UsersWithoutManagersComponent,
    canActivate: [RouteGuardService],
    resolve : [RouteGuardService]
  },

  {
    path: 'users-by-departments',
    component: UsersByDepartmentsComponent,
    canActivate: [RouteGuardService],
    resolve : [RouteGuardService]
  },

  {
    path: 'users-by-managers',
    component: UsersByManagersComponent,
    canActivate: [RouteGuardService],
    resolve : [RouteGuardService]
  },

];


@NgModule({
  declarations: [
    UsersWithoutManagersComponent,
    UsersByDepartmentsComponent,
    UsersByManagersComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CdrModule,
    EuiCoreModule,
    TranslateModule,
    DataSourceToolbarModule,
    DataTableModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    OrgChartModule,
    ReactiveFormsModule,
  ],
  exports: [
    UsersWithoutManagersComponent,
    UsersByDepartmentsComponent,
    UsersByManagersComponent
  ]
})
export class TrainingModule { }
