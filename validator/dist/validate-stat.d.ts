import { Observable } from 'rxjs';
import { Stat } from '@regionstats/models';
export declare function validateStatArrayAsync(stats: Array<Stat | string>, hashResolver: (hash: string) => Observable<any>): Observable<string>;
export declare function validateStatAsync(stat: Stat, hashResolver: (hash: string) => Observable<any>): Observable<string>;
export declare function validateStat(stat: Stat): string;
