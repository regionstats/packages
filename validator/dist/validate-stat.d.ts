import { Observable } from 'rxjs';
export declare function validateStatAsync(obj: any, hashResolver: (hash: string) => Observable<any>): Observable<string>;
export declare function validateStat(obj: any): string;
