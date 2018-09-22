import { validateStat, validateStatAsync } from "./validate-stat";
import { Observable, of, forkJoin } from 'rxjs';
import { take, concatMap, map, tap } from 'rxjs/operators'


export function validatePageAsync(obj: any, hashResolver: (hash: string) => Observable<any>): Observable<string> {
    var observables: Observable<string>[] = [];
    for (let i = 0; i < obj.stats.length; i++) {
        let stat = obj.stats[i];
        let obs: Observable<string>;
        if (typeof stat == "string" && /^[0-9a-zA-Z]{46}/.test(stat)) {
            obs = hashResolver(stat).pipe(
                take(1),
                concatMap(obj => validateStatAsync(obj, hashResolver))
            );
        } else {
            obs = validateStatAsync(stat, hashResolver);
        }
        observables.push(obs.pipe(
            map(err => {
                if (err){
                    return "stat " + (i + 1) + ": " + err;
                }
                return null;
            })
        ))
    }
    if (observables.length) {
        if (observables.length) {
            return forkJoin(observables).pipe(
                map(arr => arr.find(str => <any>str))
            );
        }
    }
    return of(null);
}
export function validatePage(obj: any): string {
    if (typeof obj != "object") {
        return "not an object"
    }
    if (!obj.hasOwnProperty("stats") || obj.stats == null) {
        return "missing stats property"
    }
    if (!Array.isArray(obj.stats)) {
        return "stats property is not an array"
    }
    if (obj.stats.length == 0) {
        return "stats array is empty"
    }
    for (let i = 0; i < obj.stats.length; i++) {
        let stat = obj.stats[i];
        let result: string | Observable<string> = null;
        if (typeof stat == "string") {
            if (/^[0-9a-zA-Z]{46}/.test(stat)) {
                //don't resolve hash here
            } else {
                return "stat " + (i + 1) + " was not a valid hash"
            }
        } else if (typeof stat == "object") {
            result = validateStat(stat);
            if (result) {
                return "stat " + (i + 1) + ": " + result;
            }
        } else {
            return "stat " + (i + 1) + " was neither a string nor an object"
        }

    }
    return null;
}
