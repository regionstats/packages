import { validateData } from "./validate-data";
import { validateSource } from "./validate-source";
import { of } from 'rxjs';
import { take, concatMap } from 'rxjs/operators';
export function validateStatAsync(obj, hashResolver) {
    var syncResult = validateStat(obj);
    if (syncResult) {
        return of(syncResult);
    }
    if (typeof obj.source == "string" && /^[0-9a-zA-Z]{46}/.test(obj.source)) {
        return hashResolver(obj.source).pipe(take(1), concatMap(function (obj) { return validateSource(obj); }));
    }
    return of(null);
}
export function validateStat(obj) {
    if (typeof obj != "object") {
        return "not an object";
    }
    //TITLE
    if (!obj.hasOwnProperty("title") || obj.title == null) {
        return "missing title property";
    }
    if (typeof obj.title != "string") {
        return "title is not a string";
    }
    if (obj.title.length == 0) {
        return "title is empty";
    }
    if (obj.title.length > 200) {
        return "title is over 200 characters";
    }
    //REGION NAME
    if (!obj.hasOwnProperty("regionName") || obj.regionName == null) {
        return "missing regionName property";
    }
    if (typeof obj.regionName != "string") {
        return "regionName is not a string";
    }
    if (obj.regionName.length == 0) {
        return "regionName is empty";
    }
    if (obj.regionName.length > 50) {
        return "regionName is over 50 characters";
    }
    //REGION TYPE
    if (!obj.hasOwnProperty("regionType") || obj.regionType == null) {
        return "missing regionType property";
    }
    if (typeof obj.regionType != "string") {
        return "regionType is not a string";
    }
    if (obj.regionType.length == 0) {
        return "regionType is empty";
    }
    if (obj.regionType.length > 20) {
        return "regionType is over 20 characters";
    }
    //DATA
    if (!obj.hasOwnProperty("data") || obj.data == null) {
        return "missing data property";
    }
    if (!Array.isArray(obj.data)) {
        return "data is not an array";
    }
    if (obj.data.length == 0) {
        return "data is empty";
    }
    if (obj.data.length > 5000) {
        return "data array has over 5000 items";
    }
    for (var i = 0; i < obj.data.length; i++) {
        var data = obj.data[i];
        if (typeof data == "object") {
            var result = validateData(data);
            if (result) {
                return "data " + (i + 1) + ": " + result;
            }
        }
        else {
            return "data " + (i + 1) + " was not an object";
        }
    }
    //REGION MAP
    if (obj.hasOwnProperty("regionMap")) {
        if (typeof obj.regionMap != "string") {
            return "regionMap is not a string";
        }
        if (!/^[0-9a-zA-Z]{46}/.test(obj.regionMap)) {
            return "regionMap was not a valid hash";
        }
    }
    //REGION INTERMEDIARY
    if (obj.hasOwnProperty("regionIntermediary")) {
        if (typeof obj.regionIntermediary != "string") {
            return "regionIntermediary is not a string";
        }
        if (obj.regionIntermediary.length == 0) {
            return "regionIntermediary is empty";
        }
        if (obj.regionIntermediary.length > 20) {
            return "regionIntermediary is over 20 characters";
        }
    }
    //YEAR
    if (obj.hasOwnProperty("year")) {
        if (typeof obj.year != "number") {
            return "year is not a number";
        }
        if (obj.year < 1000 || obj.year > 3000) {
            return "year is not in the valid range";
        }
    }
    //SOURCE
    if (obj.hasOwnProperty("source")) {
        if (typeof obj.source == "string") {
            if (/^[0-9a-zA-Z]{46}/.test(obj.source)) {
                //don't resolve hash here
            }
            else {
                return "source was not a valid hash";
            }
        }
        else if (typeof obj.source == "object") {
            var result = validateSource(obj.source);
            if (result) {
                return "source: " + result;
            }
        }
        else {
            return "source was neither a string nor an object";
        }
    }
    return null;
}
