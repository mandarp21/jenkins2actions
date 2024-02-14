export class BaseBot {
  botName: string;
  botDescription: string;
  constructor(botName?: string, botDescription?: string) {
    this.botName = botName || '';
    this.botDescription = botDescription || '';
  }
}