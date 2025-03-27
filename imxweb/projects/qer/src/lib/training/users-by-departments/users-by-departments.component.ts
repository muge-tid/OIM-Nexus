import { Component, OnInit } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { EuiLoadingService, EuiSidesheetConfig, EuiSidesheetService } from '@elemental-ui/core';
import { TranslateService } from '@ngx-translate/core';

import { DataSourceToolbarSettings, ClassloggerService, SettingsService, DataSourceWrapper, DataTableGroupedData } from 'qbm';
import { CollectionLoadParameters, CompareOperator, EntitySchema, FilterData, FilterType } from 'imx-qbm-dbts';
import { PersonConfig, PortalPersonAll } from 'imx-api-qer';

import { ProjectConfigurationService } from '../../project-configuration/project-configuration.service';
import { AddressbookDetailComponent } from '../../addressbook/addressbook-detail/addressbook-detail.component';
import { AddressbookService } from '../../addressbook/addressbook.service'
import { DepartmentService } from './department.service';
import { QerApiService } from '../../qer-api-client.service';

@Component({
  selector: 'ccc-users-by-departments',
  templateUrl: './users-by-departments.component.html',
  styleUrls: ['./users-by-departments.component.scss']
})
export class UsersByDepartmentsComponent implements OnInit {
 public dstSettings: DataSourceToolbarSettings;

 public groupData: { [key: string]: DataTableGroupedData } = {};

 public departmentList;
 public departments = new DepartmentService(this.qerApi);

 public searchParam: String;

 private personConfig: PersonConfig;
 private dstWrapper: DataSourceWrapper<PortalPersonAll>;

 public schema: EntitySchema;
 public navigationState: CollectionLoadParameters = { PageSize: 10 };

 constructor(
   private readonly euiBusyService: EuiLoadingService,
   private readonly logger: ClassloggerService,
   private readonly configService: ProjectConfigurationService,
   private readonly settingsService: SettingsService,
   private readonly addressbookService: AddressbookService,
   private readonly sidesheet: EuiSidesheetService,
   private readonly translateService: TranslateService,
   private readonly qerApi: QerApiService,
 ) {
   this.schema = this.qerApi.typedClient.PortalPersonAll.GetSchema();
 }

 public async ngOnInit(): Promise<void> {
  let overlayRef: OverlayRef;
  setTimeout(() => overlayRef = this.euiBusyService.show());

   try {
     this.personConfig = (await this.configService.getConfig()).PersonConfig;

     this.dstWrapper = await this.addressbookService.createDataSourceWrapper(
       this.personConfig.VI_MyData_WhitePages_ResultAttributes,
       'address-book'
     );

     this.dstSettings = await this.dstWrapper.getDstSettings(
       { PageSize: 10, StartIndex: 0 },
     );
   } finally {
    setTimeout(() => this.euiBusyService.hide(overlayRef));
   }
 }

 /**
  * Occurs when the navigation state has changed - e.g. users clicks on the next page button.
  *
  */
 public async onNavigationStateChanged(newState: CollectionLoadParameters): Promise<void> {
  let overlayRef: OverlayRef;
  setTimeout(() => overlayRef = this.euiBusyService.show());

   try {
     this.dstSettings = await this.dstWrapper.getDstSettings(newState);
   } finally {
    setTimeout(() => this.euiBusyService.hide(overlayRef));
   }
 }

/**
  * Occurs when user selects a person.
  *
  * @param personAll Selected person.
  */
public async onHighlightedEntityChanged(personAll: PortalPersonAll): Promise<void> {
 this.logger.debug(this, `Selected person changed`);
 this.logger.trace(this, 'New selected person', personAll);

 let overlayRef: OverlayRef;
 setTimeout(() => (overlayRef = this.euiBusyService.show()));

 let config: EuiSidesheetConfig;

 try {
   config = {
     title: await this.translateService.get('#LDS#Heading View Identity Details').toPromise(),
     padding: '0',
     width: 'max(600px, 60%)',
     testId: 'addressbook-view-identity-details',
     data: await this.addressbookService.getDetail(personAll, this.personConfig.VI_MyData_WhitePages_DetailAttributes),
   };
 } finally {
   setTimeout(() => this.euiBusyService.hide(overlayRef));
 }

 this.sidesheet.open(AddressbookDetailComponent, config);
}

public async onSearch(search: string): Promise<void> {
   //console.log('onSearch');
   console.log(`Search input received: "${search}"`);

   this.departmentList = (await this.departments.Get());


   let overlayRef: OverlayRef = this.euiBusyService.show();

   // Convert the search string to correct case
   search = search.charAt(0).toUpperCase() + search.slice(1).toLowerCase(); // modified (working)
   console.log(`Normalized search term: "${search}"`);

   // Find Department in departments-Array:
   let departmentUID = ''
   if (search.length > 0){
    console.log(this.departmentList.length)
    for (let i = 0; i < this.departmentList.length; i++) {
      //modified
      const normalizedDepartmentDisplay = this.departmentList[i].display.normalize("NFD").toLowerCase();
      const normalizedSearch = search.normalize("NFD").toLowerCase();
      console.log(`Comparing: "${normalizedDepartmentDisplay}" with "${normalizedSearch}"`);
      if (normalizedDepartmentDisplay.startsWith(normalizedSearch)) { // modified
        departmentUID = this.departmentList[i].value;
        console.log(`Match found! Department UID: ${departmentUID}`);
        break;
      }
    }
  }

   let fil: FilterData;

   try {
    if (departmentUID != ''){
    console.log("Applying filter for department UID:", departmentUID);
     fil = {
       ColumnName: 'UID_Department',
       Type: FilterType.Compare,
       CompareOp: CompareOperator.Equal,
       Value1: departmentUID,
     }
     const data = (await this.qerApi.typedClient.PortalPersonAll.Get({ StartIndex: 0, PageSize: 10, filter: [fil] }));
     console.log("Filtered data retrieved:", data);

     this.dstSettings = {
       dataSource: data,
       entitySchema: this.schema,
       navigationState: this.navigationState,
     };

    }else{
      console.log("No match found, fetching default data.");
      const data = (await this.qerApi.typedClient.PortalPersonAll.Get({ StartIndex: 0, PageSize: 10 }));
      console.log("Default data retrieved:", data);

      this.dstSettings = {
        dataSource: data,
        entitySchema: this.schema,
        navigationState: this.navigationState,
      };
    }
   } finally {
    setTimeout(() => this.euiBusyService.hide(overlayRef));
   }
 }
}
