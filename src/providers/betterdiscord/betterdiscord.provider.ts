import { Injectable } from "@nestjs/common";

const DEVELOPERS = [
  "249746236008169473", // Zerebos
  "515780151791976453", // Doggybootsy
  "917630027477159986", // zrodevkaan
  "619261917352951815" // TheLazySquid
];

@Injectable()
export class BetterDiscordProvider {
  getDeveloperIds(): Promise<string[]> {
    return Promise.resolve(DEVELOPERS);
  }
}
