/**
 * Builds a site-rooted URL that respects Astro's configured base path.
 *
 * This keeps links working both locally and on GitHub Pages project URLs.
 *
 * @param path Path segments after the configured base URL.
 * @returns A URL path prefixed with `import.meta.env.BASE_URL`.
 */
export function sitePath(path = '') {
  const baseUrl = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  const cleanPath = path.replace(/^\/+/, '');

  return `${baseUrl}${cleanPath}`;
}

/**
 * Builds a localized internal page URL.
 *
 * @param lang Language code for the first URL segment.
 * @param path Optional page or character slug after the language.
 * @returns A base-aware localized URL.
 */
export function localizedPath(lang: string, path = '') {
  return sitePath([lang, path].filter(Boolean).join('/'));
}
