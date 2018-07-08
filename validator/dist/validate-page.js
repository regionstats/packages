import { validateStat } from "./validate-stat";
import { Observable } from 'rxjs';
import 'rxjs/add/observable/forkJoin';
export function validatePage(obj, hashResolver) {
    if (typeof obj != "object") {
        return "not an object";
    }
    if (!obj.hasOwnProperty("stats")) {
        return "missing stats property";
    }
    if (!Array.isArray(obj.stats)) {
        return "stats property is not an array";
    }
    if (obj.stats.length == 0) {
        return "stats array is empty";
    }
    var observables = [];
    for (var i = 0; i < obj.stats.length; i++) {
        var stat = obj.stats[i];
        var result = null;
        if (typeof stat == "string") {
            if (/^[0-9a-zA-Z]{46}/.test(stat)) {
                if (hashResolver) {
                    result = hashResolver(stat);
                }
            }
            else {
                return "stat " + (i + 1) + " was not a valid hash";
            }
        }
        else if (typeof stat == "object") {
            result = validateStat(stat);
        }
        else {
            return "stat " + (i + 1) + " was neither a string nor an object";
        }
        if (typeof result == "string" && result) {
            return "stat " + (i + 1) + ": " + result;
        }
        if (result && typeof result == "object") {
            observables.push(result);
        }
    }
    if (observables.length) {
        return Observable.forkJoin(observables).map(function (arr) { return arr.find(function (str) { return !!str; }); });
    }
    return null;
}
