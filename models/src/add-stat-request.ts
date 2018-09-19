import { Stat } from "@regionstats/models";

export class AddStatRequest {
    name: string;
    tripcodeKey: string;
    category: string;
    stat: Stat;
}