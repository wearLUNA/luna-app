export const Colors = {
  primary: 'white',
  secondary: '#ff0066',
  background: 'black',
  text: 'black',
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
  background: Colors.primary,
  text: Colors.text,
  borderRadius: 4,
  paddingVertical: Spacing.medium,
  paddingHorizontal: Spacing.large,
  fontSize: FontSizes.medium,

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
