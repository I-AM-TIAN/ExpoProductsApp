import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';

const LogoutIconButton = () => {

    const primaryColor = useThemeColor({}, 'primary');
    const { logout } = useAuthStore();
    const queryClient = useQueryClient();

    const handleLogout = async () => {
        // Limpiar todo el caché de React Query
        queryClient.clear();
        // Hacer logout
        await logout();
    };

    return (
        <TouchableOpacity style={{ marginRight: 8 }}
            onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color={primaryColor} />
        </TouchableOpacity>
    )
}

export default LogoutIconButton;