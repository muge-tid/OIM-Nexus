import { Component, OnInit } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { Router } from '@angular/router';
import { EuiLoadingService } from '@elemental-ui/core';
import { ProjectConfig } from 'imx-api-qer';
import { ProjectConfigurationService } from '../../project-configuration/project-configuration.service';


@Component({
  selector: 'ccc-manager-tile',  
  templateUrl: './manager-tile.component.html',
  styleUrls: ['./manager-tile.component.scss']
})
export class ManagerTileComponent implements OnInit {

  public viewReady: boolean;
  public darkMode: boolean = false; //Toggle state 
  private projectConfig: ProjectConfig;

  constructor(
    private readonly router: Router,
    private readonly busyService: EuiLoadingService,
    private readonly configService: ProjectConfigurationService,
  ) { }

  public async ngOnInit(): Promise<void> {

    let overlayRef: OverlayRef;
    setTimeout(() => overlayRef = this.busyService.show());
    try {

      this.projectConfig = await this.configService.getConfig();

      this.viewReady = true;
    } finally {
      setTimeout(() => this.busyService.hide(overlayRef));
    }
  }

  // Function to display Users-by-Managers table in the traning module. 
  public openIdentitiesOverview(): void {
    this.router.navigate(['users-by-managers']);

  }

  //dark mode set to true when called useless for now
  /*
  public toggleDarkMode():void {
    this.darkMode =!this.darkMode

  }
    */
}

