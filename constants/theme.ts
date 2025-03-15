export const Colors = {
  primary: '#4CAF50',
  secondary: '#ff0066',
  background: '#000015',
  text: '#333333',
};

export const Spacing = {
  small: 8,
  medium: 16,
  large: 24,
};

export const FontSizes = {
  small: 14,
  medium: 18,
  large: 24,
};

export const Button = {
  // Default styling for all buttons
  background: Colors.primary,
  text: Colors.text,
  borderRadius: 4,
  paddingVertical: Spacing.medium,
  paddingHorizontal: Spacing.large,
  fontSize: FontSizes.medium,
  // Sizes variant for button styling
  sizes: {
    small: {
      paddingVertical: Spacing.small,
      paddingHorizontal: Spacing.medium,
      fontSize: FontSizes.small,
    },
    medium: {
      paddingVertical: Spacing.medium,
      paddingHorizontal: Spacing.large,
      fontSize: FontSizes.medium,
    },
    large: {
      paddingVertical: Spacing.large,
      paddingHorizontal: Spacing.large + 4,
      fontSize: FontSizes.large,
    },
  },
};
