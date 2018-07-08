import { Observable } from 'rxjs';
import 'rxjs/add/observable/forkJoin';
export declare function validatePage(obj: any, hashResolver?: (hash: string) => Observable<any>): Observable<string> | string;
