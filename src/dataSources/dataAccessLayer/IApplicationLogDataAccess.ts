import { ApplicationLog } from '@ngscaffolding/models';
import { Observable } from 'rxjs';

export interface IApplicationLogDataAccess {
  saveApplicationLog(applictionLog: ApplicationLog): Observable<ApplicationLog>;
}
