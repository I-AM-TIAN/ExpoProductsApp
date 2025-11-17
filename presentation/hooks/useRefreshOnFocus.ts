import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

/**
 * Hook que ejecuta una función cuando la pantalla recibe el foco
 * Útil para refrescar datos cuando el usuario navega de vuelta a una pantalla
 */
export const useRefreshOnFocus = (refetch: () => void) => {
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );
};
