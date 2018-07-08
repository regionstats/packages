export function validateData(obj) {
    if (typeof obj != "object") {
        return "not an object";
    }
    //VALUE
    if (!obj.hasOwnProperty("v")) {
        return "missing v property";
    }
    if (typeof obj.v != "number") {
        return "v is not a number";
    }
    //REGION
    if (!obj.hasOwnProperty("r")) {
        return "missing r property";
    }
    if (typeof obj.r != "string") {
        return "r is not a string";
    }
    if (obj.r.length == 0) {
        return "r is empty";
    }
    if (obj.r.length > 50) {
        return "r is over 50 characters";
    }
    //INTERMEDIARY
    if (obj.hasOwnProperty("i")) {
        if (typeof obj.i != "string") {
            return "i is not a string";
        }
        if (obj.r.length == 0) {
            return "i is empty";
        }
        if (obj.r.length > 50) {
            return "i is over 50 characters";
        }
    }
    return null;
}
