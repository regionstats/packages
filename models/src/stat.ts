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

    constructor(stat?: Stat){
        if (typeof stat != "object"){
            return;
        }
        for (var key in primitiveProps){
            if (stat[key] != null){
                this[key] = stat[key];
            }
        }
        if (Array.isArray(stat.data)){
            this.data = stat.data.map(z => new Data(z));
        }
        this.source = new Source(stat.source);
    }

    static clean(stat: Stat): void{
        for (var key in stat){
            if (primitiveProps[key]){
                if (stat[key] == null){
                    delete stat[key];
                }
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