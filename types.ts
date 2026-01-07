
export enum MessageRole {
  USER = 'user',
  BOT = 'bot'
}

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
  image?: string;
  timestamp: Date;
}

export interface QuickAction {
  label: string;
  prompt: string;
  icon: string;
}
