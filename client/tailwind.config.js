/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "on-tertiary-fixed": "var(--on-tertiary-fixed)",
        "surface-tint": "var(--surface-tint)",
        "outline-variant": "var(--outline-variant)",
        "on-background": "var(--on-background)",
        "on-primary-fixed-variant": "var(--on-primary-fixed-variant)",
        "tertiary": "var(--tertiary)",
        "error": "var(--error)",
        "surface-container-lowest": "var(--surface-container-lowest)",
        "inverse-on-surface": "var(--inverse-on-surface)",
        "on-surface": "var(--on-surface)",
        "surface-variant": "var(--surface-variant)",
        "on-surface-variant": "var(--on-surface-variant)",
        "error-container": "var(--error-container)",
        "primary-fixed": "var(--primary-fixed)",
        "on-secondary-fixed-variant": "var(--on-secondary-fixed-variant)",
        "tertiary-container": "var(--tertiary-container)",
        "on-secondary-container": "var(--on-secondary-container)",
        "primary": "var(--primary)",
        "outline": "var(--outline)",
        "secondary": "var(--secondary)",
        "on-error-container": "var(--on-error-container)",
        "inverse-primary": "var(--inverse-primary)",
        "inverse-surface": "var(--inverse-surface)",
        "secondary-fixed": "var(--secondary-fixed)",
        "on-secondary": "var(--on-secondary)",
        "surface-container-high": "var(--surface-container-high)",
        "surface-dim": "var(--surface-dim)",
        "on-primary-fixed": "var(--on-primary-fixed)",
        "surface-bright": "var(--surface-bright)",
        "tertiary-fixed": "var(--tertiary-fixed)",
        "on-error": "var(--on-error)",
        "on-secondary-fixed": "var(--on-secondary-fixed)",
        "primary-container": "var(--primary-container)",
        "on-primary": "var(--on-primary)",
        "on-tertiary": "var(--on-tertiary)",
        "on-tertiary-fixed-variant": "var(--on-tertiary-fixed-variant)",
        "secondary-container": "var(--secondary-container)",
        "background": "var(--background)",
        "surface": "var(--surface)",
        "surface-container-low": "var(--surface-container-low)",
        "on-tertiary-container": "var(--on-tertiary-container)"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "base": "8px",
        "section-gap": "64px",
        "container-padding-mobile": "16px",
        "gutter": "24px",
        "container-padding-desktop": "40px"
      },
      fontFamily: {
        "headline-md": ["Hanken Grotesk"],
        "headline-lg-mobile": ["Hanken Grotesk"],
        "body-md": ["Inter"],
        "body-lg": ["Inter"],
        "label-sm": ["Inter"],
        "data-mono": ["Inter"],
        "display": ["Hanken Grotesk"],
        "headline-lg": ["Hanken Grotesk"]
      },
      fontSize: {
        "headline-md": ["20px", {"lineHeight": "1.4", "fontWeight": "500"}],
        "headline-lg-mobile": ["24px", {"lineHeight": "1.2", "fontWeight": "500"}],
        "body-md": ["14px", {"lineHeight": "1.5", "fontWeight": "400"}],
        "body-lg": ["16px", {"lineHeight": "1.6", "fontWeight": "400"}],
        "label-sm": ["12px", {"lineHeight": "1.0", "letterSpacing": "0.05em", "fontWeight": "600"}],
        "data-mono": ["14px", {"lineHeight": "1.0", "letterSpacing": "-0.01em", "fontWeight": "500"}],
        "display": ["48px", {"lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "600"}],
        "headline-lg": ["30px", {"lineHeight": "1.2", "letterSpacing": "-0.01em", "fontWeight": "500"}]
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
