/**
 * next/image with `unoptimized: true` (required on GitHub Pages, which has
 * no server for the default /_next/image optimizer) does not apply
 * `basePath` to the rendered `src`/`srcSet` on this Next.js version, unlike
 * the default loader. A custom loader is the one hook Next always routes
 * image URL construction through, so it's the place to add the prefix back.
 */
export default function imageLoader({ src }: { src: string }): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${src}`;
}
