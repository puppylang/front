import { Pet } from './pet';

export interface ChatRoom {
  id: number;
  author_id: string;
  guest_id: string;
  post_id: number;
  post: {
    title: string | null;
    pet: Pet;
    preferred_walk_location: true;
  };
  guest: {
    image: string | null;
    name: string;
  };
  user: {
    image: string | null;
    name: string;
  };
  lastMessage?: Message;
  notReadedMessageCount: number;
}

export interface Message {
  user_id: string;
  text: string;
  time: string;
  id: number;
  is_read: boolean;
  user_image?: string;
}

export enum ChatWritterType {
  Author = 'AUTHOR',
  Guest = 'GUEST',
}

export interface CreateChatType {
  post_id: string;
  author_id: string;
  guest_id: string;
  guest_image?: string;
}

export interface SocketData {
  type: 'READ' | 'MESSAGE';
  data:
    | Message
    | {
        id: string;
      };
}
