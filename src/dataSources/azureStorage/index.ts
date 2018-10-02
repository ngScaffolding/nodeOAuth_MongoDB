import { IDataAccessLayer } from '../dataAccessLayer';
import { IClientModel } from '../../models/IClient.model';
import { IUserModel } from '../../models/IUser.model';

var azure = require('azure-storage');

export class AzureStorageDataAccess implements IDataAccessLayer {
  
  getClientFromID(clientId: string, clientSecret?: string): Promise<IClientModel> {
      
    var tableService = azure.createTableService();
    return new Promise((resolve,reject) =>{
        tableService.retrieveEntity('oauthclients', '', clientId, (error, result, response) => {
            if (!error) {
                const client = JSON.parse(result.data['_']);
                if(clientSecret && client.clientSecret !== clientSecret){
                    reject();
                }
                resolve(client);
            }else{
                reject();
            }
        });
    });

    
    return null;
    // return DB.getClientFromID(clientId, clientSecret);
  }  
  
  getUserFromID(userId: string, password?: string): Promise<IUserModel> {
    var tableService = azure.createTableService();

    return new Promise((resolve,reject) =>{
        tableService.retrieveEntity('oauthusers', '', userId, (error, result, response) => {
            if (!error) {
                const user = JSON.parse(result.data['_']);
                resolve(user);
            }else{
                reject();
            }
        });
    });
    
  }
  
  userLoggedOn(userId: string) {
      this.getUserFromID(userId).then(user => {
        user.passwordFailures = 0;
        
        var tableService = azure.createTableService();
        var entity = {
            PartitionKey: '',
            RowKey: userId,
            data: JSON.stringify(user)
          };
          tableService.replaceEntity('oauthusers', entity, function(error, result, response) {
            if (!error) {
              // result contains the entity with field 'taskDone' set to `true`
            }
          });
      });
  }
  
  userLogonFailed(userId: string) {
    this.getUserFromID(userId).then(user => {

        if(!user.passwordFailures){ user.passwordFailures = 0; }
        user.passwordFailures = user.passwordFailures + 1;
        user.passwordLastFailed = new Date();

        var tableService = azure.createTableService();
        var entity = {
            PartitionKey: '',
            RowKey: userId,
            data: JSON.stringify(user)
          };
          tableService.replaceEntity('oauthusers', entity, function(error, result, response) {
            if (!error) {
              // result contains the entity with field 'taskDone' set to `true`
            }
          });
      });
  }

}
