import React, { useRef, useState, useCallback } from 'react';
import { ScrollView, View, LayoutRectangle, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Text } from '../design-system/Text';
import { colors, spacing, radius, timing, layout } from '../design-system/tokens';
import Tab from '../../db/models/Tab';
import { AnimatedPressable } from '../design-system/AnimatedPressable';

interface Props {
  tabs: Tab[];
  activeTabId: string | null;
  onTabPress: (tab: Tab) => void;
  onAddTab: () => void;
}

export function TabStrip({ tabs, activeTabId, onTabPress, onAddTab }: Props) {
  const [tabLayouts, setTabLayouts] = useState<Record<string, LayoutRectangle>>({});
  const pillX = useSharedValue(0);
  const pillW = useSharedValue(0);
  const scrollRef = useRef<ScrollView>(null);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pillX.value }],
    width: pillW.value,
  }));

  const handleTabLayout = useCallback(
    (id: string, layout: LayoutRectangle) => {
      setTabLayouts((prev) => {
        const next = { ...prev, [id]: layout };
        if (id === activeTabId) {
          pillX.value = withTiming(layout.x, { duration: timing.normal });
          pillW.value = withTiming(layout.width, { duration: timing.normal });
        }
        return next;
      });
    },
    [activeTabId, pillX, pillW],
  );

  // Update pill when activeTabId changes
  React.useEffect(() => {
    if (activeTabId && tabLayouts[activeTabId]) {
      const l = tabLayouts[activeTabId];
      pillX.value = withTiming(l.x, { duration: timing.normal });
      pillW.value = withTiming(l.width, { duration: timing.normal });
      scrollRef.current?.scrollTo({ x: Math.max(0, l.x - 16), animated: true });
    }
  }, [activeTabId, tabLayouts]);

  return (
    <View
      style={{
        height: layout.tabStripHeight,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, alignItems: 'center', gap: 0 }}
        style={{ flex: 1 }}
      >
        {/* Animated pill background */}
        <View style={{ position: 'absolute', bottom: 0, left: spacing.lg, height: 2 }}>
          <Animated.View
            style={[pillStyle, { height: 2, backgroundColor: colors.accent, borderRadius: 1 }]}
          />
        </View>

        {tabs.map((tab) => (
          <Pressable
            key={tab.id}
            onPress={() => onTabPress(tab)}
            onLayout={(e) => handleTabLayout(tab.id, e.nativeEvent.layout)}
            style={({ pressed }) => ({
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.sm,
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.xs,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            {tab.emoji && (
              <Text style={{ fontSize: 14, lineHeight: 18 }}>{tab.emoji}</Text>
            )}
            <Text
              variant="small"
              weight={tab.id === activeTabId ? '600' : '400'}
              color={tab.id === activeTabId ? 'primary' : 'secondary'}
              numberOfLines={1}
            >
              {tab.title}
            </Text>
          </Pressable>
        ))}

        {/* Add tab button */}
        <Pressable
          onPress={onAddTab}
          style={({ pressed }) => ({
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <Text style={{ color: colors.textTertiary, fontSize: 20, lineHeight: 24 }}>+</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
