import { ThemedText } from '@/presentation/theme/components/themed-text';
import { useThemeColor } from '@/presentation/theme/hooks/use-theme-color';
import { useWindowDimensions, View } from 'react-native';

const RegisterScreen = () => {
  const { height } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, 'background');
  return (
    <View>
      <ThemedText>RegisterScreen</ThemedText>
    </View>
  )
}

export default RegisterScreen;