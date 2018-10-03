import { IDataAccessLayer  } from './dataSources/dataAccessLayer';
import { MongoDBDataAccess } from './dataSources/mongodb';
import { AzureStorageDataAccess } from './dataSources/azureStorage';
// import { DocumentDBDataAccess } from './dataSources/documentdb';

require('dotenv').config();

export interface IDataSourceSwitch{
    dataSource: IDataAccessLayer;
}

class DataSourceSwitch {
    constructor() {
        switch(process.env.DATA_SOURCE.toLowerCase()){
            case 'mongodb':{
                console.log('Running MongoDB Data Source');
                this.dataSource = new MongoDBDataAccess();
                break;
            }
            case 'azurestorage':{
                console.log('Running Azure Storage Data Source');
                this.dataSource = new AzureStorageDataAccess();
                break;
            }
            case 'documentdb':{
                console.log('Running DocumentDB Data Source');
                // this.dataSource = new DocumentDBDataAccess();
                break;
            }
            case 'kumulos':{
                
            }
        }
    }

    public dataSource: IDataAccessLayer;
}

const dataSourceSwitch = new DataSourceSwitch();

export default dataSourceSwitch;
