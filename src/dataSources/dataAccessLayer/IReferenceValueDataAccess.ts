import { Observable } from 'rxjs/Rx';
import { ReferenceValue } from '@ngscaffolding/models';

export interface IReferenceValueDataAccess {
  getReferenceValues(name: string, seed: string, group: string): Observable<ReferenceValue[]>;
  addReferenceValue(referenceValue: ReferenceValue): Observable<ReferenceValue>;
}
