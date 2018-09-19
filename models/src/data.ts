var primitiveProps = {
    v: true, 
    r: true, 
    i: true
};

export class Data {
    v: number;
    r: string;
    i: string;
    
    constructor(obj: any){
        if (typeof obj != "object"){
            return;
        }
        for (var key in primitiveProps){
            this[key] = obj[key];
        }
    }

    static clean(data: Data): void{
        for (var key in data){
            if (!primitiveProps[key]){
                delete data[key];
            }
        }
    }
}