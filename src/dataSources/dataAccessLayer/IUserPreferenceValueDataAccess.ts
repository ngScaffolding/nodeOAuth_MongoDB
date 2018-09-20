import { UserPreferenceValue } from '@ngscaffolding/models';
import { Observable } from 'rxjs';

export interface IUserPreferenceValueDataAccess {

    // Get All Menu Items - For Admin Purposes
    getUserPreferenceValues(): Observable<UserPreferenceValue>;
    saveUserPreferenceValue(name: string, value: string): Observable<UserPreferenceValue>;
    deleteUserPreferenceValue(name: string): Observable<UserPreferenceValue>;
}