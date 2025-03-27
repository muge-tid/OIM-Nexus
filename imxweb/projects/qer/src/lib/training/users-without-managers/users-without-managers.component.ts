import { Component, OnInit } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { EuiLoadingService, EuiSidesheetConfig, EuiSidesheetService } from '@elemental-ui/core';
import { TranslateService } from '@ngx-translate/core';
import { DataSourceToolbarSettings, ClassloggerService, SettingsService, DataSourceWrapper, DataTableGroupedData } from 'qbm';
import { PersonConfig, PortalPersonAll } from 'imx-api-qer';
import { FilterData, FilterType, CompareOperator, CollectionLoadParameters } from 'imx-qbm-dbts';
import { ProjectConfigurationService} from '../../project-configuration/project-configuration.service';
import { AddressbookService } from '../../addressbook/addressbook.service';
import { AddressbookDetailComponent } from '../../addressbook/addressbook-detail/addressbook-detail.component';
import { FilterProperty, LogOp, SqlExpression } from 'imx-qbm-dbts';


@Component({
  selector: 'ccc-users-without-managers',
  templateUrl: './users-without-managers.component.html',
  styleUrls: ['./users-without-managers.component.scss']
})

export class UsersWithoutManagersComponent implements OnInit {

  public dstSettings: DataSourceToolbarSettings;

  public groupData: { [key: string]: DataTableGroupedData } = {};

  private personConfig: PersonConfig;
  private dstWrapper: DataSourceWrapper<PortalPersonAll>;

  constructor(
    private readonly busyService: EuiLoadingService,
    private readonly logger: ClassloggerService,
    private readonly settingsService: SettingsService,

    private readonly sidesheet: EuiSidesheetService,
    private readonly translateService: TranslateService,
    private readonly configService : ProjectConfigurationService,
    private readonly addressbookService : AddressbookService,
  ) { }

  public async ngOnInit(): Promise<void> {
    let overlayRef: OverlayRef;
    setTimeout(() => overlayRef = this.busyService.show());
/*
    const identitiesWithoutManagers : FilterData = {
      ColumnName : 'UID_PersonHead',
      Type : FilterType.Compare,
      CompareOp : CompareOperator.Equal,
      Value1 : null
    }

*/


  const identitiesWithoutManagersAndDepartments: SqlExpression = {
    LogOperator: 0,
    Expressions: [
      {
        LogOperator: 2,
        PropertyId: "UID_PersonHead",
        Operator: CompareOperator.Equal.toString(), 
        Value: null
      },
      {
        LogOperator: 2,
        PropertyId: "UID_Department",
        Operator: CompareOperator.Equal.toString(),
        Value: null
      }
    ]
      
  };

 // wrapped to filter data
  const filterData: FilterData[] = identitiesWithoutManagersAndDepartments.Expressions.map(expression => ({
    ColumnName: expression.PropertyId,
    Type: FilterType.Compare,
    CompareOp: CompareOperator[expression.Operator as keyof typeof CompareOperator],
    Value1: expression.Value
  }));

/* // ÇALIŞAN HALİ
const identitiesWithoutManagersAndDepartments: FilterData[] = [ 
    {    
      ColumnName: 'UID_PersonHead',     
      Type: FilterType.Compare,     
      CompareOp: CompareOperator.Equal,     
      Value1: null  
    },  
    {    
      ColumnName: 'UID_Department',     
      Type: FilterType.Compare, 
      CompareOp: CompareOperator.Equal, 
      Value1: null } 
    ];
*/
    try {
      this.personConfig = (await this.configService.getConfig()).PersonConfig;

      this.dstWrapper = await this.addressbookService.createDataSourceWrapper(
        this.personConfig.VI_MyData_WhitePages_ResultAttributes, 'address-book'
      );

      this.dstSettings = await this.dstWrapper.getDstSettings(
        { 
          PageSize: 10, StartIndex: 0,
          filter: filterData,

         }
      );
    } finally {
      setTimeout(() => this.busyService.hide(overlayRef));
    }
  }

  /**
   * Occurs when the navigation state has changed - e.g. users clicks on the next page button.
   *
   */
  public async onNavigationStateChanged(newState: CollectionLoadParameters): Promise<void> {
    let overlayRef: OverlayRef;
    setTimeout(() => overlayRef = this.busyService.show());

    try {
      this.dstSettings = await this.dstWrapper.getDstSettings(newState);
    } finally {
      setTimeout(() => this.busyService.hide(overlayRef));
    }
  }

  public async onGroupingChange(groupKey: string): Promise<void> {
    let overlayRef: OverlayRef;
    setTimeout(() => overlayRef = this.busyService.show());

    try {
      const groupData = this.groupData[groupKey];
      groupData.settings = await this.dstWrapper.getGroupDstSettings(groupData.navigationState);
      groupData.data = groupData.settings.dataSource;
    } finally {
      setTimeout(() => this.busyService.hide(overlayRef));
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
    setTimeout(() => overlayRef = this.busyService.show());

    let config: EuiSidesheetConfig;

    try {
      config = {
        title: await this.translateService.get('#LDS#Heading View Identity Details').toPromise(),
        headerColour: 'iris-blue',
        padding: '0',
        width: 'max(600px, 60%)',
        data: await this.addressbookService.getDetail(
          personAll,
          this.personConfig.VI_MyData_WhitePages_DetailAttributes
        )
      };
    } finally {
      setTimeout(() => this.busyService.hide(overlayRef));
    }

    this.sidesheet.open(AddressbookDetailComponent, config);
  }

  public async onSearch(search: string): Promise<void> {
    let overlayRef: OverlayRef;
    setTimeout(() => overlayRef = this.busyService.show());

    try {
      this.dstSettings = await this.dstWrapper.getDstSettings({ StartIndex: 0, search });
    } finally {
      setTimeout(() => this.busyService.hide(overlayRef));
    }
  }
}
