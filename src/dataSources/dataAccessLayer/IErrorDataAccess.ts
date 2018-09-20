import { Observable } from 'rxjs';
import { ErrorModel } from '@ngscaffolding/models'

export interface IErrorDataAccess {
    saveError(error: ErrorModel): void;
}

// Id	int	Unchecked
// DateRecorded	datetime2(7)	Unchecked
// Message	nvarchar(MAX)	Checked
// Source	nvarchar(200)	Checked
// StackTrace	nvarchar(MAX)	Checked
// UserId	nvarchar(100)	Checked
// Name	nvarchar(200)	Checked
// 		Unchecked