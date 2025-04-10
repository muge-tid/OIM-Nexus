import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagerTileComponent } from './manager-tile/manager-tile.component';
import { RouteGuardService } from 'qbm';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { EuiCoreModule } from '@elemental-ui/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';
import { DataSourceToolbarModule, DataTableModule, CdrModule } from 'qbm';
import { OrgChartModule } from '../org-chart/org-chart.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TileModule } from 'qbm';


@NgModule({
  declarations: [
    ManagerTileComponent
  ],
  imports: [
    CommonModule,
    TileModule,
    TranslateModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    EuiCoreModule,
    MatIconModule,
 
  ],
  exports: [
    ManagerTileComponent
  ]
})
export class NexusModule { }
