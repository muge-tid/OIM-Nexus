import { Component, OnInit } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { EuiLoadingService, EuiSidesheetConfig, EuiSidesheetService } from '@elemental-ui/core';
import { TranslateService } from '@ngx-translate/core';

import { DataSourceToolbarSettings, DataSourceToolbarFilter, ClassloggerService, SettingsService, DataSourceWrapper, DataTableGroupedData } from 'qbm';
import { CollectionLoadParameters, CompareOperator, EntitySchema, FilterData, FilterType, DisplayColumns, IClientProperty, ValType, TypedEntityCollectionData } from 'imx-qbm-dbts';
import { PersonConfig, PortalPersonAll, PortalPersonUid } from 'imx-api-qer';

import { ProjectConfigurationService } from '../../project-configuration/project-configuration.service';
import { AddressbookDetailComponent } from '../../addressbook/addressbook-detail/addressbook-detail.component';
import { AddressbookService } from '../../addressbook/addressbook.service'
import { ManagersService } from './managers.service';
import { QerApiService } from '../../qer-api-client.service';
import { IEntityColumn } from 'imx-qbm-dbts';

@Component({
  selector: 'ccc-users-by-managers',
  templateUrl: './users-by-managers.component.html',
  styleUrls: ['./users-by-managers.component.scss']
})
export class UsersByManagersComponent implements OnInit {

   public dstSettings: DataSourceToolbarSettings;
  
   public groupData: { [key: string]: DataTableGroupedData } = {};
  
   public managerList;
   public managers = new ManagersService(this.qerApi);
  
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
         this.personConfig.VI_MyData_WhitePages_DetailAttributes,
         'address-book',
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
 
    this.managerList = (await this.managers.Get())
 
 
    let overlayRef: OverlayRef;
    setTimeout(() => (overlayRef = this.euiBusyService.show()));
 
    // Convert the search string to correct case
    // search = search.charAt(0).toUpperCase() + search.slice(1).toLowerCase(); // modified (working)
    // console.log(`Normalized search term: "${search}"`);
 
    let managerUID: string[] = [];

    if (search.length > 0){
     console.log(this.managerList.length)
     for (let i = 0; i < this.managerList.length; i++) {

       const normalizedManagerFirstName = this.managerList[i].firstName.normalize("NFD").toLowerCase();
       const normalizedManagerLastName = this.managerList[i].lastName.normalize("NFD").toLowerCase();
       const normalizedSearch = search.normalize("NFD").toLowerCase();

       console.log(`Comparing: "${normalizedManagerFirstName}" with "${normalizedSearch}" and "${normalizedManagerLastName}" with "${normalizedSearch}" `);

       if (normalizedManagerFirstName.startsWith(normalizedSearch) || normalizedManagerLastName.startsWith(normalizedSearch)){
         if (!(managerUID.indexOf(this.managerList[i].value) >= 0)){
           console.log(`Adding "${this.managerList[i].display} to the manager list`);
           managerUID.push(this.managerList[i].value);
         }
       }
     }

     console.log(`Found "${managerUID.length}" many managers`);
   }

   let filterArray = []

   for (let index = 0; index < managerUID.length; index++) {
     const fil: FilterData = {
       ColumnName: 'UID_PersonHead',
       Type: FilterType.Compare,
       CompareOp: CompareOperator.Equal,
       Value1: managerUID[index]
     }

     console.log("Filter created:", fil);

     filterArray.push(fil)
   }
 
    try {
     let data = {
       IsLimitReached: undefined,
       tableName: "Person",
       totalCount: 0,
       Data: [],
       extendedData: undefined
     };
     for (let index = 0; index < filterArray.length; index++) {
       const filteredData = (await this.qerApi.typedClient.PortalPersonAll.Get({ StartIndex: 0, PageSize: 10, filter: [filterArray[index]] }));
       console.log("Fetched filtered data:", filteredData);
       for (let i = 0; i < filteredData.totalCount; i++) {
         data.Data.push(filteredData.Data[i]);
         data.totalCount += 1;
       }
     }

     console.log("Final data:", data)
 
      this.dstSettings = {
        dataSource: data,
        entitySchema: this.schema,
        navigationState: this.navigationState,
      };

    } finally {
     setTimeout(() => this.euiBusyService.hide(overlayRef));
    }
  }

 }


  
