import { useState } from 'react';

const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">' +
      '<rect width="300" height="200" fill="#eef1f5"/>' +
      '<g fill="none" stroke="#adb5bd" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">' +
      '<rect x="120" y="62" width="60" height="50" rx="6"/><circle cx="138" cy="80" r="6"/><path d="M124 108l18-16 12 10 10-8 16 14"/></g>' +
      '<text x="150" y="148" font-family="sans-serif" font-size="15" text-anchor="middle" fill="#6c757d">Sin foto</text>' +
      '</svg>',
  );

interface ProductImageProps {
  src: string;
  alt: string;
  height?: number;
  className?: string;
}

/** Muestra la foto; si no existe o falla la carga, muestra una imagen de relleno. */
export function ProductImage({ src, alt, height = 160, className = '' }: ProductImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  return (
    <img
      src={failedSrc === src ? PLACEHOLDER : src}
      alt={alt}
      loading="lazy"
      className={`w-100 ${className}`.trim()}
      style={{ height, objectFit: 'contain' }}
      onError={() => setFailedSrc(src)}
    />
  );
}
