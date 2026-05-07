import { ImgHTMLAttributes, useMemo } from "react";

/**
 * Picture — automatically serves AVIF/WebP next to the JPG/PNG fallback.
 *
 * Pass the imported asset URL (Vite-fingerprinted) as `src`. The component
 * derives sibling `.avif` and `.webp` URLs from the same hashed path, so
 * Vite's asset graph still includes them (we import them from the call-sites
 * and pass the resolved URLs through the optional `avifSrc`/`webpSrc` props).
 *
 * If only `src` is provided we attempt path swap as a best-effort progressive
 * enhancement — browsers without AVIF/WebP automatically fall back to <img>.
 */
export interface PictureProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  avifSrc?: string;
  webpSrc?: string;
  alt: string;
  /** Sets fetchpriority + loading=eager on the underlying <img> for LCP candidates. */
  priority?: boolean;
}

function swapExt(src: string, ext: "avif" | "webp") {
  return src.replace(/\.(jpe?g|png)(\?.*)?$/i, `.${ext}$2`);
}

export default function Picture({
  src,
  avifSrc,
  webpSrc,
  alt,
  priority = false,
  loading,
  ...rest
}: PictureProps) {
  const avif = useMemo(() => avifSrc ?? swapExt(src, "avif"), [avifSrc, src]);
  const webp = useMemo(() => webpSrc ?? swapExt(src, "webp"), [webpSrc, src]);

  return (
    <picture style={{ display: "contents" }}>
      <source srcSet={avif} type="image/avif" />
      <source srcSet={webp} type="image/webp" />
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : (loading ?? "lazy")}
        decoding="async"
        // @ts-expect-error fetchpriority is a valid HTML attribute not in older types
        fetchpriority={priority ? "high" : "auto"}
        {...rest}
      />
    </picture>
  );
}
