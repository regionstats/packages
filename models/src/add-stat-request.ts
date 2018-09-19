import { Stat } from "./stat";

export class AddStatRequest {
    name: string;
    tripcodeKey: string;
    category: string;
    stat: Stat;
}