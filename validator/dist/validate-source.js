export function validateSource(source) {
    if (typeof source != "object") {
        return "not an object";
    }
    //TITLE
    if (!source.hasOwnProperty("title") || source.title == null) {
        return "missing title property";
    }
    if (typeof source.title != "string") {
        return "title is not a string";
    }
    if (source.title.length == 0) {
        return "title is empty";
    }
    if (source.title.length > 50) {
        return "title is over 200 characters";
    }
    //YEAR
    if (source.hasOwnProperty("year") && source.year != null) {
        if (typeof source.year != "number") {
            return "year is not a number";
        }
        if (source.year < 1000 || source.year > 3000) {
            return "year is not in the valid range";
        }
    }
    //PUBLISHER
    if (source.hasOwnProperty("publisher") && source.publisher != null) {
        if (typeof source.publisher != "string") {
            return "publisher is not a string";
        }
        if (source.publisher.length == 0) {
            return "publisher is empty";
        }
        if (source.publisher.length > 100) {
            return "publisher is over 100 characters";
        }
    }
    //URL
    if (source.hasOwnProperty("url") && source.url != null) {
        if (typeof source.url != "string") {
            return "url is not a string";
        }
        if (/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(source.url)) {
            return "url is not a valid URL";
        }
    }
}
