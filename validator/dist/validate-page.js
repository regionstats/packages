import { validateStat, validateStatAsync } from "./validate-stat";
import { of, forkJoin } from 'rxjs';
import { take, concatMap, map } from 'rxjs/operators';
export function validatePageAsync(obj, hashResolver) {
    var observables = [];
    var _loop_1 = function (i) {
        var stat = obj.stats[i];
        var obs = void 0;
        if (typeof stat == "string" && /^[0-9a-zA-Z]{46}/.test(stat)) {
            obs = hashResolver(stat).pipe(take(1), concatMap(function (obj) { return validateStatAsync(obj, hashResolver); }));
        }
        else {
            obs = validateStatAsync(stat, hashResolver);
        }
        observables.push(obs.pipe(map(function (err) {
            if (err) {
                return "stat " + (i + 1) + ": " + err;
            }
            return null;
        })));
    };
    for (var i = 0; i < obj.stats.length; i++) {
        _loop_1(i);
    }
    if (observables.length) {
        if (observables.length) {
            return forkJoin(observables).pipe(map(function (arr) { return arr.find(function (str) { return str; }); }));
        }
    }
    return of(null);
}
export function validatePage(obj) {
    if (typeof obj != "object") {
        return "not an object";
    }
    if (!obj.hasOwnProperty("stats") || obj.stats == null) {
        return "missing stats property";
    }
    if (!Array.isArray(obj.stats)) {
        return "stats property is not an array";
    }
    if (obj.stats.length == 0) {
        return "stats array is empty";
    }
    for (var i = 0; i < obj.stats.length; i++) {
        var stat = obj.stats[i];
        var result = null;
        if (typeof stat == "string") {
            if (/^[0-9a-zA-Z]{46}/.test(stat)) {
                //don't resolve hash here
            }
            else {
                return "stat " + (i + 1) + " was not a valid hash";
            }
        }
        else if (typeof stat == "object") {
            result = validateStat(stat);
            if (result) {
                return "stat " + (i + 1) + ": " + result;
            }
        }
        else {
            return "stat " + (i + 1) + " was neither a string nor an object";
        }
    }
    return null;
}
