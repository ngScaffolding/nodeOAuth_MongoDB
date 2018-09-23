import { IDataAccessLayer } from '../dataAccessLayer';
import {
  ApplicationLogController,
  ErrorImplementation,
  ReferenceValueImplementation,
  DataSourceImplementation,
  MenuItemsImplementation,
  UserPreferenceDefinitionController,
  UserPreferenceValueController
} from './implementation';

export class MongoDBDataAccess implements IDataAccessLayer {
  UserPreferenceDefinitionController = new UserPreferenceDefinitionController();
  UserPreferenceValueController = new UserPreferenceValueController();
  applicationLogController = new ApplicationLogController();
  dataSourceController = new DataSourceImplementation();
  errorController = new ErrorImplementation();
  menuItemsController = new MenuItemsImplementation();
  referenceValuesController = new ReferenceValueImplementation();
}
