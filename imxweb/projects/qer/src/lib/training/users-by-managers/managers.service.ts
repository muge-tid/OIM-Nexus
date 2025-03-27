import { Injectable } from '@angular/core';
import { QerApiService } from "../../qer-api-client.service";

@Injectable({
  providedIn: 'root'
})
export class ManagersService {

  constructor(
    private readonly qerApi: QerApiService
  ) {}

  busy = false;
  // Loading all locations
  managers = [];
  public async Get() {
    try {
      this.busy = true;

      const pageSize = 10;
      let startIndex = 0;
      
      let managerData;
      
      do {
        managerData = await this.qerApi.typedClient.PortalAdminPerson.Get({ StartIndex: startIndex, PageSize: pageSize });
  
        for (let manager of managerData.Data) {
          const managerFullName = manager.GetEntity().GetDisplay();
          const managerFirstName = manager.GetEntity().GetColumn('FirstName').GetValue();
          const managerLastName = manager.GetEntity().GetColumn('LastName').GetValue();
  
          this.managers.push({
            display: managerFullName,
            firstName: managerFirstName,
            lastName: managerLastName,
            value: manager.EntityKeysData.Keys[0]
          });
        }
        console.log(startIndex);
        startIndex += pageSize;
        
      } while (managerData.Data.length === pageSize); // Continue until no more data
  
    } finally {
      this.busy = false;
    }
    return this.managers.sort((a, b) => a.display.localeCompare(b.display));
  }
  
}
