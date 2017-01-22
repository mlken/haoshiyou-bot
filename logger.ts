import {Message, Contact} from "wechaty";
import {FriendRequest} from "wechaty/dist/src/friend-request";

const file = 'log.json';
let jsonfile = require('jsonfile');

class HsyBotLogObject {
  public type: HsyBotLoggerType;
  public contact:Contact;
  public groupEnum:HsyGroupEnum;
  public rawChatMessage:Message; // for logging the original messsage
  public friendRequestMessage:string;
  public debugMessage:string;
  public timestamp:Date;
  constructor() {
    this.timestamp = new Date();
  }
}

/**
 * Please never reuse enum ids, since things here goes into logs.
 *
 * NextId = 7;
 */
export enum HsyGroupEnum {
  TestGroup = 0,
  SouthBayEast = 1,
  SouthBayWest = 2,
  EastBay = 3,
  SanFrancisco = 4,
  MidPeninsula = 5,
  ShortTerm = 6,
}

/**
 * Please never reuse enum ids, since things here goes into logs.
 *
 * NextId = 5;
 */
export enum HsyBotLoggerType {
  debugInfo = 1,
  chatEvent = 2,
  friendRequestEvent = 3,
  botAddToGroupEvent = 4
}

export class HsyBotLogger {
  public static async logBotAddToGroupEvent(contact:Contact,
                                            groupEnum:HsyGroupEnum):Promise<void> {
    let logItem = new HsyBotLogObject();
    logItem.type = HsyBotLoggerType.botAddToGroupEvent;
    logItem.groupEnum = groupEnum;
    logItem.contact = contact;
    await HsyBotLogger.log(logItem);
  }
  public static async logFriendRequest(requestMessage:FriendRequest):Promise<void> {
    let logItem = new HsyBotLogObject();
    logItem.type = HsyBotLoggerType.friendRequestEvent;
    logItem.contact = requestMessage.contact;
    logItem.friendRequestMessage = requestMessage.hello;
    await HsyBotLogger.log(logItem);
  }

  public static async logRawChatMsg(message: Message):Promise<void> {
    let logItem = new HsyBotLogObject();
    logItem.type = HsyBotLoggerType.chatEvent;
    logItem.rawChatMessage = message;
    await HsyBotLogger.log(logItem);
  }

  private static async log(logItem:HsyBotLogObject):Promise<void> {
    console.log(`XXX DEBUG LOG ${JSON.stringify(logItem)}`);
    await jsonfile.writeFileSync(file, logItem, {flag: 'a'});
  }

  public static async logDebug(str:string):Promise<void> {
    let logItem = new HsyBotLogObject();
    logItem.type = HsyBotLoggerType.debugInfo;
    logItem.debugMessage = str;
    await this.log(logItem);
  }
}