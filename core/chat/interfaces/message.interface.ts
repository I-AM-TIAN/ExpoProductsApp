export interface Message {
  id: string;
  content: string;
  conversationId: string;
  senderId: string;
  isRead: boolean;
  createdAt: string;
  sender?: MessageSender;
}

export interface MessageSender {
  id: string;
  nombres: string;
  apellidos: string;
}

export interface SendMessageDto {
  conversationId: string;
  message: string;
  senderId: string;
}

export interface TypingEvent {
  conversationId: string;
  userId: string;
  userName: string;
}

export interface JoinChatDto {
  conversationId: string;
  userId: string;
}

export interface MarkAsReadDto {
  conversationId: string;
  userId: string;
}
