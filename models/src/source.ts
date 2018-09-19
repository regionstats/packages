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

    constructor(obj: any){
        if (typeof obj != "object"){
            return;
        }
        for (var key in primitiveProps){
            this[key] = obj[key];
        }
    }

    static clean(source: Source): void{
        for (var key in source){
            if (!primitiveProps[key]){
                delete source[key];
            }
        }
    }
}