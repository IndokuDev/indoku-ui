import type { SystemConfig } from "./types"

export const defaultTheme: NonNullable<SystemConfig["theme"]> = {
  tokens: {
    colors: {
      brand: {
        50: { value: "#fafafa" }, 100: { value: "#f5f5f5" }, 200: { value: "#e5e5e5" },
        300: { value: "#d4d4d4" }, 400: { value: "#a3a3a3" }, 500: { value: "#737373" },
        600: { value: "#525252" }, 700: { value: "#404040" }, 800: { value: "#262626" },
        900: { value: "#171717" }, 950: { value: "#0a0a0a" },
      },
      gray: {
        50: { value: "#fafafa" }, 100: { value: "#f5f5f5" }, 200: { value: "#e5e5e5" },
        300: { value: "#d4d4d4" }, 400: { value: "#a3a3a3" }, 500: { value: "#737373" },
        600: { value: "#525252" }, 700: { value: "#404040" }, 800: { value: "#262626" },
        900: { value: "#171717" }, 950: { value: "#0a0a0a" },
      },
      red: { 50: { value: "#fff0f0" }, 500: { value: "#d92d43" }, 600: { value: "#b91c35" } },
      green: { 50: { value: "#eafaf1" }, 500: { value: "#178653" }, 600: { value: "#126b42" } },
    },
    spacing: {
      0: { value: "0" }, 1: { value: "4px" }, 2: { value: "8px" }, 3: { value: "12px" },
      4: { value: "16px" }, 5: { value: "20px" }, 6: { value: "24px" }, 8: { value: "32px" },
      10: { value: "40px" }, 12: { value: "48px" }, 16: { value: "64px" },
    },
    sizes: {
      xs: { value: "20rem" }, sm: { value: "24rem" }, md: { value: "28rem" }, lg: { value: "32rem" },
      xl: { value: "36rem" }, full: { value: "100%" }, screen: { value: "100vw" },
    },
    radii: {
      none: { value: "0" }, sm: { value: "4px" }, md: { value: "6px" }, lg: { value: "8px" },
      xl: { value: "12px" }, full: { value: "9999px" },
    },
    fontSizes: {
      xs: { value: "12px" }, sm: { value: "14px" }, md: { value: "16px" }, lg: { value: "20px" },
      xl: { value: "24px" }, "2xl": { value: "32px" }, "3xl": { value: "40px" },
    },
    fontWeights: {
      normal: { value: 400 }, medium: { value: 500 }, semibold: { value: 600 }, bold: { value: 700 },
    },
    lineHeights: { tight: { value: 1.2 }, normal: { value: 1.5 }, relaxed: { value: 1.75 } },
    shadows: {
      sm: { value: "0 1px 2px rgb(0 0 0 / 8%)" },
      md: { value: "0 8px 24px rgb(0 0 0 / 10%)" },
      lg: { value: "0 20px 48px rgb(0 0 0 / 14%)" },
    },
  },
  semanticTokens: {
    colors: {
      "fg.default": { value: { base: "{colors.gray.900}", _dark: "{colors.gray.50}" } },
      "fg.muted": { value: { base: "{colors.gray.600}", _dark: "{colors.gray.300}" } },
      "fg.subtle": { value: { base: "{colors.gray.500}", _dark: "{colors.gray.400}" } },
      "bg.canvas": { value: { base: "#ffffff", _dark: "#0a0a0a" } },
      "bg.surface": { value: { base: "#ffffff", _dark: "#171717" } },
      "bg.subtle": { value: { base: "{colors.gray.100}", _dark: "{colors.gray.800}" } },
      "border.subtle": { value: { base: "{colors.gray.200}", _dark: "{colors.gray.700}" } },
      "border.default": { value: { base: "{colors.gray.300}", _dark: "{colors.gray.600}" } },
      "primary.default": { value: { base: "{colors.gray.900}", _dark: "{colors.gray.100}" } },
      "primary.foreground": { value: { base: "{colors.gray.50}", _dark: "{colors.gray.900}" } },
      "accent.default": { value: { base: "{colors.gray.900}", _dark: "{colors.gray.100}" } },
      "accent.hover": { value: { base: "{colors.gray.800}", _dark: "{colors.gray.200}" } },
      "status.success": { value: { base: "{colors.green.600}", _dark: "{colors.green.500}" } },
      "status.danger": { value: { base: "{colors.red.600}", _dark: "{colors.red.500}" } },
      "status.warning": { value: { base: "#a16207", _dark: "#facc15" } },
      "status.info": { value: { base: "#2563eb", _dark: "#60a5fa" } },
      "status.neutral": { value: { base: "{colors.gray.500}", _dark: "{colors.gray.400}" } },
    },
  },
}
