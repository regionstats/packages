import { Observable } from 'rxjs';
export declare function validateStat(obj: any, hashResolver?: (hash: string) => Observable<any>): Observable<string> | string;
