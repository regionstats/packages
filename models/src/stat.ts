import { Source } from "./source";
import { Data } from "./data";

var primitiveProps = {
    title: true, 
    regionName: true, 
    regionType: true, 
    regionIntermediary: true, 
    year: true, 
    regionMap: true
};


export class Stat {
    title: string;
    data: Data[];
    regionName: string;
    regionType: string;
    regionIntermediary: string;
    year: number;
    source: Source;
    regionMap: string;

    constructor(obj: any){
        if (typeof obj != "object"){
            return;
        }
        for (var key in primitiveProps){
            this[key] = obj[key];
        }
        if (Array.isArray(obj.data)){
            this.data = obj.data.map(z => new Data(z));
        }
        this.source = new Source(obj.source);
    }

    static clean(stat: Stat): void{
        for (var key in stat){
            if (primitiveProps[key]){
                continue;
            } else if (key == "data" && Array.isArray(stat.data)){
                stat.data.forEach(z => Data.clean(z));
            } else if (key == "source"){
                Source.clean(stat.source);
            } else {
                delete stat[key];
            }
        }
    }
}