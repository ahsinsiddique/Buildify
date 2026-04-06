/**
 * Central application config.
 * Change appName and logoUrl here — every component that imports this
 * will pick up the update automatically.
 */
const appConfig = {
  /** Display name used in headings, titles, and nav */
  appName: "Buildify",

  /** Short tag shown above headings (e.g. sidebar eyebrow) */
  appTag: "Builder ERP",

  /** One-line description for meta tags and hero copy */
  description: "Construction and real estate operations in one system.",

  /** Path to logo image served from /public */
  logoUrl: "/logo.png",

  /** Alt text for the logo image */
  logoAlt: "Buildify logo",
} as const;

export default appConfig;
