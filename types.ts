
export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: string;
  gender: '公' | '母';
  weight: string;
  image_url: string;
  description: string;
  category: string;
  is_vaccinated: boolean;
  is_neutered: boolean;
  tags: string[];
  shelter_name?: string;
}

export interface Message {
  id: string;
  senderName: string;
  senderAvatar: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
}

export type AppTab = 'home' | 'discover' | 'message' | 'profile';
