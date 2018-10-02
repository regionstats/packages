import { validateData } from "./validate-data";
import { validateSource } from "./validate-source";
import { Observable, of, forkJoin } from 'rxjs';
import { take, concatMap, map } from 'rxjs/operators';
import { Stat } from '@regionstats/models';

export function validateStatArrayAsync(stats: Array<Stat | string>, hashResolver: (hash: string) => Observable<any>): Observable<string> {
    if (!Array.isArray(stats)){
        return of("not an array");
    }
    var observables: Observable<string>[] = [];
    for (let i = 0; i < stats.length; i++) {
        let stat = stats[i];
        let obs: Observable<string>;
        if (typeof stat == "string") {
            if (/^[0-9a-zA-Z]{46}/.test(stat)){
                obs = hashResolver(stat).pipe(
                    take(1),
                    concatMap(obj => validateStatAsync(obj, hashResolver))
                );
            } else {
                obs = of("neither an object nor a valid hash");
            }
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

export function validateStatAsync(stat: Stat, hashResolver: (hash: string) => Observable<any>): Observable<string> {
    var syncResult = validateStat(stat);
    if (syncResult) {
        return of(syncResult);
    } 
    if (typeof stat.source == "string" && /^[0-9a-zA-Z]{46}/.test(stat.source)) {
        return hashResolver(stat.source).pipe(
            take(1),
            concatMap(obj => validateSource(obj))
        )
    }
    return of(null);
}


export function validateStat(stat: Stat): string {
    if (typeof stat != "object") {
        return "not an object"
    }
    //TITLE
    if (!stat.hasOwnProperty("title") || stat.title == null) {
        return "missing title property"
    }
    if (typeof stat.title != "string") {
        return "title is not a string"
    }
    if (stat.title.length == 0) {
        return "title is empty"
    }
    if (stat.title.length > 200) {
        return "title is over 200 characters"
    }
    //REGION NAME
    if (!stat.hasOwnProperty("regionName") || stat.regionName == null) {
        return "missing regionName property"
    }
    if (typeof stat.regionName != "string") {
        return "regionName is not a string"
    }
    if (stat.regionName.length == 0) {
        return "regionName is empty"
    }
    if (stat.regionName.length > 50) {
        return "regionName is over 50 characters"
    }
    //REGION TYPE
    if (!stat.hasOwnProperty("regionType") || stat.regionType == null) {
        return "missing regionType property"
    }
    if (typeof stat.regionType != "string") {
        return "regionType is not a string"
    }
    if (stat.regionType.length == 0) {
        return "regionType is empty"
    }
    if (stat.regionType.length > 20) {
        return "regionType is over 20 characters"
    }
    //DATA
    if (!stat.hasOwnProperty("data") || stat.data == null) {
        return "missing data property"
    }
    if (!Array.isArray(stat.data)) {
        return "data is not an array"
    }
    if (stat.data.length == 0) {
        return "data is empty"
    }
    if (stat.data.length > 10000) {
        return "data array has over 10000 items"
    }
    for (let i = 0; i < stat.data.length; i++){
        let data = stat.data[i];
        if (typeof data == "object") {
            let result = validateData(data);
            if (result) {
                return "data " + (i + 1) + ": " + result;
            }
        } else {
            return "data " + (i + 1) + " was not an object"
        }
    }
    //REGION MAP
    if (stat.hasOwnProperty("regionMap") && stat.regionMap != null) {
        if (typeof stat.regionMap != "string") {
            return "regionMap is not a string"
        }
        if (!/^[0-9a-zA-Z]{46}/.test(stat.regionMap)) {
            return "regionMap was not a valid hash"
        }
    }
    //REGION INTERMEDIARY
    if (stat.hasOwnProperty("regionIntermediary") && stat.regionIntermediary != null) {
        if (typeof stat.regionIntermediary != "string") {
            return "regionIntermediary is not a string"
        }
        if (stat.regionIntermediary.length == 0) {
            return "regionIntermediary is empty"
        }
        if (stat.regionIntermediary.length > 20) {
            return "regionIntermediary is over 20 characters"
        }
    }
    //YEAR
    if (stat.hasOwnProperty("year") && stat.year != null) {
        if (typeof stat.year != "number") {
            return "year is not a number"
        }
        if (stat.year < 1000 || stat.year > 3000) {
            return "year is not in the valid range"
        }
    }
    //SOURCE
    if (stat.hasOwnProperty("source") && stat.source != null) {

        if (typeof stat.source == "string") {
            if (/^[0-9a-zA-Z]{46}/.test(stat.source)) {
                //don't resolve hash here
            } else {
                return "source was not a valid hash"
            }
        } else if (typeof stat.source == "object") {
            let result = validateSource(stat.source);
            if (result) {
                return "source: " + result;
            }
        } else {
            return "source was neither a string nor an object"
        }
    }
    return null;
}