import React from 'react';
import { Pressable, PressableProps, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { timing } from './tokens';

interface Props extends PressableProps {
  style?: StyleProp<ViewStyle>;
  haptic?: boolean;
  scaleDown?: number;
  children: React.ReactNode;
}

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

export function AnimatedPressable({
  style,
  haptic = false,
  scaleDown = 0.97,
  onPress,
  children,
  ...props
}: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressableBase
      style={[animatedStyle, style]}
      onPressIn={() => {
        scale.value = withTiming(scaleDown, { duration: timing.fast });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: timing.fast });
      }}
      onPress={(e) => {
        if (haptic) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress?.(e);
      }}
      {...props}
    >
      {children}
    </AnimatedPressableBase>
  );
}
