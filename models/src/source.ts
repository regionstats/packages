var primitiveProps = {
    title: true, 
    year: true, 
    publisher: true,
    url: true
};

export class Source {
    title: string
    year: number;
    publisher: string;
    url: string;

    constructor(source?: Source){
        if (typeof source != "object"){
            return;
        }
        for (var key in primitiveProps){
            this[key] = source[key];
        }
    }

    static clean(source: Source): void{
        for (var key in source){
            if (!primitiveProps[key] || source[key] == null){
                delete source[key];
            }
        }
    }
}