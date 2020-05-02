import { IDataAccessLayer } from '../dataAccessLayer';
import { Role, IUserModel, IClientModel } from '../../models/index';
import { MSSQLHelpers } from './msSQLHelpers';

const sql = require('mssql');

export class MsSQLDataAccess implements IDataAccessLayer {
  private tablePrefix = '';
  private async runCommand(sqlCommand: string): Promise<any> {
    // Load the connection string
    let connString = process.env['DB_HOST'];
    let pool = await new sql.ConnectionPool(connString).connect();

    return pool.query(sqlCommand);
  }

  constructor() {
    // Are we prefixing table names?
    if (process.env.TABLE_PREFIX) {
      this.tablePrefix = process.env.TABLE_PREFIX;
    }
  }
  getClientFromID(clientId: string, clientSecret?: string): Promise<IClientModel> {
    return new Promise((resolve, reject) => {
      this.runCommand(`SELECT [Name],[Value] FROM [dbo].[${this.tablePrefix}OAuthClients] Where Name = '${clientId}'`).then(results => {
        let retVal: IClientModel = null;
        if (results.recordset && results.recordset.length === 1) {
          retVal = JSON.parse(results.recordset[0]['Value']);
          if (clientSecret && retVal.clientSecret !== clientSecret) {
            reject();
            return;
          }
        }
        resolve(retVal);
      });
    });
  }

  getUserFromID(userId: string, password?: string): Promise<IUserModel> {
    return new Promise((resolve, reject) => {
      this.runCommand(`SELECT [Value] FROM [dbo].[${this.tablePrefix}OAuthUsers] Where UserID = '${userId}'`).then(results => {
        let retVal: IUserModel = null;
        if (results.recordset && results.recordset.length === 1) {
          retVal = JSON.parse(results.recordset[0]['Value']);
        }
        resolve(retVal);
      });
    });
  }
  userLoggedOn(userId: string) {
      this.getUserFromID(userId).then(user => {
        user.passwordFailures = 0;
        user.passwordLastFailed = null;
        this.updateUser(user);
    });
  }
  userLogonFailed(userId: string) {
    this.getUserFromID(userId).then(user => {
      if (!user.passwordFailures) {
        user.passwordFailures = 0;
      }
      user.passwordFailures = user.passwordFailures + 1;
      user.passwordLastFailed = new Date();

      this.updateUser(user);
    });
  }
  getUsers(): Promise<IUserModel[]> {
    return new Promise((resolve, reject) => {
          this.runCommand(`SELECT [UserID] ,[Value] FROM [dbo].[${this.tablePrefix}OAuthUsers]`).then(results => {
            let retVal: IUserModel[] = [];
            if (results.recordset) {
              for (const loopValue of results.recordset) {
                retVal.push(JSON.parse(loopValue['Value']));
              }
            }
            resolve(retVal);
          });
        });
  }

  addUser(user: IUserModel) {
    return this.runCommand(`INSERT INTO [dbo].[${this.tablePrefix}OAuthUsers] ([UserID],[Value])
        VALUES (${MSSQLHelpers.valueWithQuotesOrNull(user.userId)},${MSSQLHelpers.valueWithQuotesOrNull(JSON.stringify(user))})`);
  }
  
  updateUser(user: IUserModel) {
    
    return this.runCommand(`UPDATE [dbo].[${this.tablePrefix}OAuthUsers]
            SET [Value] = ${MSSQLHelpers.valueWithQuotesOrNull(JSON.stringify(user))}
            WHERE [UserID] = ${MSSQLHelpers.valueWithQuotesOrNull(user.userId)}`);
  }
  deleteUser(userId: string) {
    
    return this.runCommand(`DELETE FROM  [dbo].[${this.tablePrefix}OAuthUsers]
            WHERE [UserID] = ${MSSQLHelpers.valueWithQuotesOrNull(userId)}`);
  }
  getRole(name: string): Promise<Role> {
    return new Promise((resolve, reject) => {
      this.runCommand(`SELECT [Value] FROM [dbo].[${this.tablePrefix}OAuthRoles] Where [Name] = '${name}'`).then(results => {
        let retVal: Role = null;
        if (results.recordset && results.recordset.length === 1) {
          retVal = JSON.parse(results.recordset[0]['Value']);
        }
        resolve(retVal);
      });
    });
  }
  getAllRoles(): Promise<Role[]> {
    return new Promise((resolve, reject) => {
      this.runCommand(`SELECT [Name] ,[Value] FROM [dbo].[${this.tablePrefix}OAuthRoles]`).then(results => {
        let retVal: Role[] = [];
        if (results.recordset) {
          for (const loopValue of results.recordset) {
            retVal.push(JSON.parse(loopValue['Value']));
          }
        }
        resolve(retVal);
      });
    });
  }

  // saveApplicationLog(applicationLog: ApplicationLog): Promise<ApplicationLog> {
  //   return this.runCommand(`INSERT INTO [dbo].[${this.tablePrefix}ApplicationLogs]
  //                ([LogDate]
  //                ,[UserID]
  //                ,[LogType]
  //                ,[Description]
  //                ,[EndPoint]
  //                ,[HttpCommand]
  //                ,[Values])
  //          VALUES
  //                (${MSSQLHelpers.valueWithQuotesOrNull(applicationLog.logDate)}
  //                ,${MSSQLHelpers.valueWithQuotesOrNull(applicationLog.userID)}
  //                ,${MSSQLHelpers.valueWithQuotesOrNull(applicationLog.logType)}
  //                ,${MSSQLHelpers.valueWithQuotesOrNull(applicationLog.description)}
  //                ,${MSSQLHelpers.valueWithQuotesOrNull(applicationLog.endPoint)}
  //                ,${MSSQLHelpers.valueWithQuotesOrNull(applicationLog.httpCommand)}
  //                ,${MSSQLHelpers.valueWithQuotesOrNull(applicationLog.values)}
  //                )`);
  // }
  // getAppSettingsValues(): Promise<AppSettingsValue[]> {
  //   return new Promise((resolve, reject) => {
  //     this.runCommand(`SELECT [Name] ,[Value] FROM [dbo].[${this.tablePrefix}ApplicationSettings]`).then(results => {
  //       let retVal: AppSettingsValue[] = [];
  //       if (results.recordset) {
  //         for (const appSetting of results.recordset) {
  //           retVal.push({ name: appSetting['Name'], value: appSetting['Value'] });
  //         }
  //       }
  //       resolve(retVal);
  //     });
  //   });
  // }

  // getDataSource(name: string | string[]): Promise<BaseDataSource> {
  //   return new Promise((resolve, reject) => {
  //     this.runCommand(`SELECT [Name],[Value] FROM [dbo].[${this.tablePrefix}DataSources] Where Name = '${name}'`).then(results => {
  //       let retVal: BaseDataSource = null;
  //       if (results.recordset && results.recordset.length === 1) {
  //         retVal = JSON.parse(results.recordset[0]['Value']);
  //         var x =0;
  //       }
  //       resolve(retVal);
  //     });
  //   });
  // }
  // saveDataSource(dataSource: BaseDataSource): Promise<BaseDataSource> {
  //   throw new Error('Method not implemented.');
  // }
  // saveError(error: ErrorModel): void {
  //   this.runCommand(`INSERT INTO [dbo].[${this.tablePrefix}ErrorLog]
  //              ([Message],[StackTrace],[DateRecorded],[Source],[UserID])
  //        VALUES
  //              (${MSSQLHelpers.valueWithQuotesOrNull(error.message)}
  //              ,${MSSQLHelpers.valueWithQuotesOrNull(error.stackTrace)}
  //              ,${MSSQLHelpers.valueWithQuotesOrNull(error.dateRecorded)}
  //              ,${MSSQLHelpers.valueWithQuotesOrNull(error.source)}
  //              ,${MSSQLHelpers.valueWithQuotesOrNull(error.userId)})`);
  // }
  // getMenuItem(name: string): Promise<CoreMenuItem> {
  //   return new Promise((resolve, reject) => {
  //     this.runCommand(`SELECT [Name],[Value] FROM [dbo].[${this.tablePrefix}MenuItems] Where Name = '${name}'`).then(results => {
  //       let retVal: CoreMenuItem = null;
  //       if (results.recordset && results.recordset.length === 1) {
  //         retVal = JSON.parse(results.recordset[0]['Value']);
  //       }
  //       resolve(retVal);
  //     });
  //   });
  // }
  // getMenuItems(): Promise<CoreMenuItem[]> {
  //   return new Promise((resolve, reject) => {
  //     this.runCommand(`SELECT [Name] ,[Value] FROM [dbo].[${this.tablePrefix}MenuItems]`).then(results => {
  //       let retVal: CoreMenuItem[] = [];
  //       if (results.recordset) {
  //         for (const loopValue of results.recordset) {
  //           retVal.push(JSON.parse(loopValue['Value']));
  //         }
  //       }
  //       resolve(retVal);
  //     });
  //   });
  // }
  // saveMenuItem(menuItem: CoreMenuItem): Promise<CoreMenuItem> {
  //   throw new Error('Method not implemented.');
  // }
  // deleteMenuItem(name: string): Promise<any> {
  //   throw new Error('Method not implemented.');
  // }
  // getReferenceValue(name: string): Promise<ReferenceValue> {
  //   return new Promise((resolve, reject) => {
  //     this.runCommand(`SELECT [Name],[Value] FROM [dbo].[${this.tablePrefix}ReferenceValues] Where Name = '${name}'`).then(results => {
  //       let retVal: ReferenceValue = null;
  //       if (results.recordset && results.recordset.length === 1) {
  //         retVal = JSON.parse(results.recordset[0]['Value']);
  //       }
  //       resolve(retVal);
  //     });
  //   });
  // }
  // saveReferenceValue(referenceValue: ReferenceValue): Promise<ReferenceValue> {
  //   throw new Error('Method not implemented.');
  // }
  // getRoles(): Promise<Role[]> {
  //   throw new Error('Method not implemented.');
  // }
  // deleteRole(name: string): Promise<any> {
  //   throw new Error('Method not implemented.');
  // }
  // addRole(role: Role): Promise<any> {
  //   throw new Error('Method not implemented.');
  // }
  // updateRole(role: Role): Promise<any> {
  //   throw new Error('Method not implemented.');
  // }
  // getUserPreferenceDefinitions(): Promise<UserPreferenceDefinition[]> {
  //   return new Promise((resolve, reject) => {
  //     this.runCommand(`SELECT [Name] ,[Value] FROM [dbo].[${this.tablePrefix}UserPreferenceDefinitions]`).then(results => {
  //       let retVal: UserPreferenceDefinition[] = [];
  //       if (results.recordset) {
  //         for (const loopValue of results.recordset) {
  //           retVal.push(JSON.parse(loopValue['Value']));
  //         }
  //       }
  //       resolve(retVal);
  //     });
  //   });
  // }
  // saveUserPreferenceDefinition(userPreferenceDefinition: UserPreferenceDefinition): Promise<UserPreferenceDefinition> {
  //   throw new Error('Method not implemented.');
  // }
  // getUserPreferenceValues(userId: string): Promise<UserPreferenceValue[]> {
  //   return new Promise((resolve, reject) => {
  //     this.runCommand(
  //       `SELECT [Name] ,[Value] FROM [dbo].[${this.tablePrefix}UserPreferenceValues]
  //       WHERE [KeyName] like '${userId}::%'`
  //     ).then(results => {
  //       let retVal: UserPreferenceValue[] = [];
  //       if (results.recordset) {
  //         for (const loopValue of results.recordset) {
  //           retVal.push({ name: loopValue['Name'], value: loopValue['Value'], userId: userId });
  //         }
  //       }
  //       resolve(retVal);
  //     });
  //   });
  // }
  // saveUserPreferenceValue(userPreference: UserPreferenceValue): Promise<UserPreferenceValue> {
  //   return new Promise((resolve, reject) => {
  //     var key = this.getUserPrefKey(userPreference.userId, userPreference.name);
  //     this.runCommand(
  //       `IF EXISTS (SELECT * from [UserPreferenceValues] WHERE [KeyName] = '${key}')
  //       UPDATE [dbo].[UserPreferenceValues] SET [Value] = ${MSSQLHelpers.valueWithQuotesOrNull(userPreference.value)} WHERE  Name = '${key}'
  //         ELSE
  //       INSERT INTO [dbo].[UserPreferenceValues] ([KeyName],[Name],[Value]) VALUES ('${key}', ${MSSQLHelpers.valueWithQuotesOrNull(userPreference.name)}, ${MSSQLHelpers.valueWithQuotesOrNull(userPreference.value)})`
  //     ).then(results => {
  //       let retVal: UserPreferenceValue[] = [];
  //       if (results.recordset) {
  //         for (const loopValue of results.recordset) {
  //           retVal.push(JSON.parse(loopValue['Value']));
  //         }
  //       }
  //       resolve(null);
  //     });
  //   });
  // }
  // deleteUserPreferenceValue(userId: string, name: string): Promise<any> {
  //   throw new Error('Method not implemented.');
  // }
  // getAllProfiles(): Promise<UserPreferenceValue[]> {
  //   throw new Error('Method not implemented.');
  // }
  // getWidget(name: string): Promise<WidgetModelBase> {
  //   return new Promise((resolve, reject) => {
  //     this.runCommand(`SELECT [Name],[Value] FROM [dbo].[${this.tablePrefix}Widgets] Where Name = '${name}'`).then(results => {
  //       let retVal: WidgetModelBase = null;
  //       if (results.recordset && results.recordset.length === 1) {
  //         retVal = JSON.parse(results.recordset[0]['Value']);
  //       }
  //       resolve(retVal);
  //     });
  //   });
  // }
  // getAllWidgets(): Promise<WidgetModelBase[]> {
  //   return new Promise((resolve, reject) => {
  //     this.runCommand(`SELECT [Name] ,[Value] FROM [dbo].[${this.tablePrefix}Widgets]`).then(results => {
  //       let retVal: WidgetModelBase[] = [];
  //       if (results.recordset) {
  //         for (const loopValue of results.recordset) {
  //           retVal.push(JSON.parse(loopValue['Value']));
  //         }
  //       }
  //       resolve(retVal);
  //     });
  //   });
  // }
}
