import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface ChatInputProps {
  onSend: (message: string) => void;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onTypingStart,
  onTypingStop,
  placeholder = "Escribe un mensaje...",
}) => {
  const [message, setMessage] = useState("");
  const typingTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTextChange = (text: string) => {
    setMessage(text);

    // Emitir evento de escritura
    if (onTypingStart) {
      onTypingStart();
    }

    // Limpiar timeout anterior
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Detener indicador después de 2 segundos sin escribir
    typingTimeoutRef.current = setTimeout(() => {
      if (onTypingStop) {
        onTypingStop();
      }
    }, 2000);
  };

  const handleSend = () => {
    if (!message.trim()) return;

    onSend(message.trim());
    setMessage("");

    // Detener indicador de escritura
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (onTypingStop) {
      onTypingStop();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!message.trim()}
        >
          <Ionicons
            name="send"
            size={20}
            color={message.trim() ? "#FFFFFF" : "#9CA3AF"}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    fontSize: 15,
    color: "#111827",
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4F7942",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#E5E7EB",
  },
});
