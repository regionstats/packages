export function validateSource(obj) {
    if (typeof obj != "object") {
        return "not an object";
    }
    //TITLE
    if (!obj.hasOwnProperty("title")) {
        return "missing title property";
    }
    if (typeof obj.title != "string") {
        return "title is not a string";
    }
    if (obj.title.length == 0) {
        return "title is empty";
    }
    if (obj.title.length > 50) {
        return "title is over 200 characters";
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
    //PUBLISHER
    if (obj.hasOwnProperty("publisher")) {
        if (typeof obj.publisher != "string") {
            return "publisher is not a string";
        }
        if (obj.publisher.length == 0) {
            return "publisher is empty";
        }
        if (obj.publisher.length > 100) {
            return "publisher is over 100 characters";
        }
    }
    //URL
    if (obj.hasOwnProperty("url")) {
        if (typeof obj.url != "string") {
            return "url is not a string";
        }
        if (/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(obj.url)) {
            return "url is not a valid URL";
        }
    }
}
