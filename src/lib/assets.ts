// Public assets must include the repository prefix when hosted on GitHub Pages.
export function assetUrl(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
}
