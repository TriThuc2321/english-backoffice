import type { MetaDescriptor } from 'react-router';

const BRAND_NAME = 'MyEnglish';

/** Tab title suffix: `{pageTitle} | MyEnglish`. */
export function formatPageTitle(pageTitle: string): string {
  return `${pageTitle} | ${BRAND_NAME}`;
}

/**
 * Standard SEO/social descriptors for app pages.
 */
export function pageMeta(
  pageTitle: string,
  description: string,
): MetaDescriptor[] {
  const title = formatPageTitle(pageTitle);

  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
  ];
}
