import React, { useState } from 'react';
import {
  Modal,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { Text } from '../design-system/Text';
import { AnimatedPressable } from '../design-system/AnimatedPressable';
import { colors, spacing, radius, typography } from '../design-system/tokens';

const COMMON_EMOJIS = [
  '📄','📝','📖','📚','📋','✅','☑️','🎯','🏆','💡','⭐','🔥','💼','🎨','🎭',
  '🧩','🔧','⚙️','🚀','💻','📊','📈','💰','🌍','🏠','🎵','🎮','🍕','☕','🌱',
  '🦋','🌟','💎','🎁','🔑','📌','📍','🗒️','🗂️','🗃️','📂','📁','🖊️','✏️','🖋️',
];

interface Props {
  visible: boolean;
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

export function EmojiPicker({ visible, onSelect, onClose }: Props) {
  const [search, setSearch] = useState('');
  const filtered = search
    ? COMMON_EMOJIS.filter((e) => e.includes(search))
    : COMMON_EMOJIS;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={{ flex: 1, backgroundColor: colors.overlay }} onPress={onClose} activeOpacity={1}>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: colors.surface,
            borderTopLeftRadius: radius.xl,
            borderTopRightRadius: radius.xl,
            padding: spacing.xl,
            maxHeight: Dimensions.get('window').height * 0.5,
          }}
        >
          <View style={{ alignItems: 'center', marginBottom: spacing.lg }}>
            <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border }} />
          </View>
          <Text variant="label" color="secondary" style={{ marginBottom: spacing.sm }}>
            Choose an emoji
          </Text>
          <ScrollView>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              {filtered.map((emoji) => (
                <AnimatedPressable
                  key={emoji}
                  onPress={() => { onSelect(emoji); onClose(); }}
                  style={{
                    width: 44,
                    height: 44,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: radius.sm,
                    backgroundColor: colors.surfaceElevated,
                  }}
                >
                  <Text style={{ fontSize: 24 }}>{emoji}</Text>
                </AnimatedPressable>
              ))}
            </View>
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
