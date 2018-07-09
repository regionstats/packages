import { Observable } from 'rxjs';
export declare function validatePageAsync(obj: any, hashResolver: (hash: string) => Observable<any>): Observable<string>;
export declare function validatePage(obj: any): string;
