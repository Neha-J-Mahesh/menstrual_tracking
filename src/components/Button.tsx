import { StyleSheet, Pressable, Text, ViewStyle } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  style,
}: ButtonProps) {
  const sizeStyles = {
    sm: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, fontSize: typography.fontSize.body },
    md: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg, fontSize: typography.fontSize.body },
    lg: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl, fontSize: typography.fontSize.subtitle },
  };

  const variantStyles = {
    primary: { backgroundColor: colors.teal[500] },
    secondary: { backgroundColor: colors.pink[200] },
    outline: { backgroundColor: 'transparent', borderWidth: 2, borderColor: colors.teal[500] },
    danger: { backgroundColor: colors.error[500] },
  };

  const textColor =
    variant === 'outline' ? colors.teal[500] :
    variant === 'secondary' ? colors.pink[800] :
    colors.white;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, { fontSize: sizeStyles[size].fontSize, color: textColor }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontFamily: typography.fontFamily.bold,
  },
});
