export function validateData(data) {
    if (typeof data != "object") {
        return "not an object";
    }
    //VALUE
    if (!data.hasOwnProperty("v") || data.v == null) {
        return "missing v property";
    }
    if (typeof data.v != "number") {
        return "v is not a number";
    }
    //REGION
    if (!data.hasOwnProperty("r") || data.r == null) {
        return "missing r property";
    }
    if (typeof data.r != "string") {
        return "r is not a string";
    }
    if (data.r.length == 0) {
        return "r is empty";
    }
    if (data.r.length > 50) {
        return "r is over 50 characters";
    }
    //INTERMEDIARY
    if (data.hasOwnProperty("i") && data.i != null) {
        if (typeof data.i != "string") {
            return "i is not a string";
        }
        if (data.r.length == 0) {
            return "i is empty";
        }
        if (data.r.length > 50) {
            return "i is over 50 characters";
        }
    }
    return null;
}
