import { validateStat } from "./validate-stat";
import { Observable, of, forkJoin } from 'rxjs';
import { take, concatMap, map } from 'rxjs/operators'


export function validatePageAsync(obj: any, hashResolver: (hash: string) => Observable<any>): Observable<string> {
    var syncResult = validatePage(obj);
    if (syncResult) {
        return of(syncResult);
    }
    var observables: Observable<string>[] = [];
    for (let i = 0; i < obj.stats.length; i++) {
        let stat = obj.stats[i];
        if (typeof stat == "string" && /^[0-9a-zA-Z]{46}/.test(stat)) {
            observables.push(hashResolver(stat).pipe(
                take(1),
                concatMap(obj => validateStat(obj)))
            )
        }
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
    if (!obj.hasOwnProperty("stats")) {
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
