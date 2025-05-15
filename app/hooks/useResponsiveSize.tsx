import { useWindowDimensions } from 'react-native';

export function useResponsiveSize() {
  const { width, height } = useWindowDimensions();
 
  const isTablet = width >= 600;
  
  return {
    isTablet,
    fontSize: {
      small: isTablet ? 16 : 12,
      normal: isTablet ? 18 : 14,
      large: isTablet ? 24 : 18,
      xlarge: isTablet ? 32 : 24,
      xxlarge: isTablet ? 40 : 30,
    },
    spacing: {
      small: isTablet ? 8 : 5,
      normal: isTablet ? 16 : 10,
      large: isTablet ? 24 : 15,
      xlarge: isTablet ? 32 : 20,
    },
    buttonSize: {
      height: isTablet ? 60 : 45,
      minWidth: isTablet ? 180 : 120,
      paddingHorizontal: isTablet ? 30 : 20,
      borderRadius: isTablet ? 10 : 5,
    },
    inputSize: {
      height: isTablet ? 70 : 50,
      fontSize: isTablet ? 24 : 18,
    },
  };
}