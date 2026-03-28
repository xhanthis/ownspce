import React from 'react';
import { Modal, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { AnimatedPressable } from '../design-system/AnimatedPressable';
import { Text } from '../design-system/Text';
import { colors, spacing, radius } from '../design-system/tokens';
import { BlockType } from '../../types/block';

interface BlockOption {
  type: BlockType;
  icon: string;
  label: string;
  description: string;
}

const BLOCK_OPTIONS: BlockOption[] = [
  { type: 'text', icon: '¶', label: 'Text', description: 'Plain paragraph' },
  { type: 'heading', icon: 'H1', label: 'Heading 1', description: 'Large heading' },
  { type: 'todo', icon: '☐', label: 'Todo', description: 'Checkbox item' },
  { type: 'bullet', icon: '•', label: 'Bullet', description: 'Bulleted list' },
  { type: 'numbered', icon: '1.', label: 'Numbered', description: 'Numbered list' },
  { type: 'divider', icon: '—', label: 'Divider', description: 'Horizontal rule' },
  { type: 'quote', icon: '"', label: 'Quote', description: 'Blockquote' },
  { type: 'code', icon: '<>', label: 'Code', description: 'Code block' },
];

interface Props {
  visible: boolean;
  onSelect: (type: BlockType) => void;
  onClose: () => void;
}

export function AddBlockMenu({ visible, onSelect, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' }}
        onPress={onClose}
        activeOpacity={1}
      >
        <TouchableOpacity activeOpacity={1}>
          <View
            style={{
              backgroundColor: colors.surface,
              borderTopLeftRadius: radius.xl,
              borderTopRightRadius: radius.xl,
              padding: spacing.xl,
              maxHeight: Dimensions.get('window').height * 0.6,
            }}
          >
            <View style={{ alignItems: 'center', marginBottom: spacing.lg }}>
              <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border }} />
            </View>
            <Text variant="label" color="secondary" style={{ marginBottom: spacing.md }}>
              Add block
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {BLOCK_OPTIONS.map((opt) => (
                <AnimatedPressable
                  key={opt.type}
                  haptic
                  onPress={() => { onSelect(opt.type); onClose(); }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: spacing.md,
                    paddingVertical: spacing.md,
                    paddingHorizontal: spacing.sm,
                    borderRadius: radius.md,
                  }}
                >
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: radius.sm,
                      backgroundColor: colors.surfaceElevated,
                      borderWidth: 1,
                      borderColor: colors.border,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text variant="label" weight="700" style={{ fontFamily: undefined }}>
                      {opt.icon}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="body" weight="500">{opt.label}</Text>
                    <Text variant="caption" color="secondary">{opt.description}</Text>
                  </View>
                </AnimatedPressable>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
