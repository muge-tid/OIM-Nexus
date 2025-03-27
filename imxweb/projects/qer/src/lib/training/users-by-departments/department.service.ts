import { Injectable } from '@angular/core';
import { QerApiService } from "../../qer-api-client.service";

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(
    private readonly qerApi: QerApiService
  ) {}

  busy = false;
  // Loading all locations
  departments = [];
  public async Get() {
    try {
      this.busy = true;


      const department = await this.qerApi.typedClient.PortalAdminRoleDepartment.Get();
      const departmentTotalCount = department.totalCount;


      for (let i = 0; i < departmentTotalCount; i++) {
        const departmentData = await (await this.qerApi.typedClient.PortalAdminRoleDepartment.Get({ StartIndex: i, PageSize: 10 })); //changed
        for (let department of departmentData.Data) {
          const departmentName = department.GetEntity().GetDisplay();


          this.departments.push({ display: departmentName, value: department.EntityKeysData.Keys[0] });
        }
      }
    } finally {
      // Even if the call fails, reset the busy flag
      this.busy = false;
    }


    const sortedDepartments = this.departments.sort((a, b) => a.display.localeCompare(b.display)); //modified 

    return sortedDepartments;
  }
}

