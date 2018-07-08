import { validateStat } from "./validate-stat";
import { Observable } from 'rxjs';
import 'rxjs/add/observable/forkJoin';

export function validatePage(obj: any, hashResolver?: (hash: string) => Observable<any>): Observable<string> | string {
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
    let observables: Observable<string>[] = [];
    for (let i = 0; i < obj.stats.length; i++){
        let stat = obj.stats[i];
        let result: string | Observable<string> = null;
        if (typeof stat == "string") {
            if (/^[0-9a-zA-Z]{46}/.test(stat)) {
                if (hashResolver) {
                    result = hashResolver(stat).take(1).concatMap(obj => validateStat(obj, hashResolver))
                }
            } else {
                return "stat " + (i + 1) + " was not a valid hash"
            }
        } else if (typeof stat == "object") {
            result = validateStat(stat, hashResolver);
        } else {
            return "stat " + (i + 1) + " was neither a string nor an object"
        }
        
        if (typeof result == "string" && result) {
            return "stat " + (i + 1) + ": " + result;
        }
        if (result && typeof result == "object") {
            observables.push(result);
        }
    }
    if(observables.length){
        return Observable.forkJoin(observables).map(arr => arr.find(str => !!str));
    }
    return null;
}
