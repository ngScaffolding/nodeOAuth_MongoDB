import { IApplicationLogDataAccess } from "./IApplicationLogDataAccess";
import { IDataSourceDataAccess } from "./IDataSourceDataAccess";
import { IErrorDataAccess } from "./IErrorDataAccess";
import { IMenuItemsDataAccess } from "./IMenuItemsDataAccess";
import { IReferenceValueDataAccess } from './IReferenceValueDataAccess';
import { IUserPreferenceDefinitionDataAccess } from "./IUserPreferenceDefinitionDataAccess";
import { IUserPreferenceValueDataAccess } from "./IUserPreferenceValueDataAccess";

export interface IDataAccessLayer {
    applicationLogController: IApplicationLogDataAccess;
    dataSourceController: IDataSourceDataAccess;
    errorController: IErrorDataAccess;
    menuItemsController: IMenuItemsDataAccess;
    referenceValuesController: IReferenceValueDataAccess;
    UserPreferenceDefinitionController: IUserPreferenceDefinitionDataAccess
    UserPreferenceValueController: IUserPreferenceValueDataAccess
}