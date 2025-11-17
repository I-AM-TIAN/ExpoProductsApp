export interface Conversation {
  id: string;
  user1Id: string;
  user2Id: string;
  productId?: string;
  lastMessage?: string;
  createdAt: string;
  updatedAt: string;
  user1?: ConversationUser;
  user2?: ConversationUser;
  product?: ConversationProduct;
  otherUser?: ConversationUser;
  unreadCount?: number;
}

export interface ConversationUser {
  id: string;
  nombres: string;
  apellidos: string;
  images?: Array<{
    id: number;
    url: string;
    isProfileImage: boolean;
  }>;
}

export interface ConversationProduct {
  id: string;
  name: string;
  images: string[];
}

export interface CreateConversationDto {
  otherUserId: string;
  productId?: string;
}
