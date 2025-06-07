import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <svg
          width="24"
          height="24"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Layer0 Logo"
          viewBox="0 0 24 24"
          fill="none"
        >
          <rect
            x="2"
            y="4"
            width="20"
            height="16"
            rx="2"
            fill="currentColor"
            opacity="0.1"
          />
          <rect x="4" y="6" width="16" height="3" rx="1" fill="currentColor" />
          <rect x="4" y="11" width="12" height="3" rx="1" fill="currentColor" />
          <rect x="4" y="16" width="8" height="2" rx="1" fill="currentColor" />
        </svg>
        Layer0
      </>
    ),
  },
  // see https://fumadocs.dev/docs/ui/navigation/links
  links: [
    {
      text: "Documentation",
      url: "/docs",
      active: "nested-url",
    },
    {
      text: "GitHub",
      url: "https://github.com/layer0-team/layer0",
      external: true,
    },
  ],
};
