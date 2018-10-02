var primitiveProps = {
    v: true, 
    r: true, 
    i: true
};

export class Data {
    v: number;
    r: string;
    i: string;
    
    constructor(data?: Data){
        if (typeof data != "object"){
            return;
        }
        for (var key in primitiveProps){
            this[key] = data[key];
        }
    }

    static clean(data: Data): void{
        for (var key in data){
            if (!primitiveProps[key] || data[key] == null){
                delete data[key];
            }
        }
    }
}