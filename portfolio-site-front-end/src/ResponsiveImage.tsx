import React from 'react';

interface ResponsiveImageProps {
  smallSrc: string;
  mediumSrc: string;
  largeSrc: string;
  alt: string;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({ smallSrc, mediumSrc, largeSrc, alt }) => (
  <img
    src={smallSrc}
    srcSet={`${mediumSrc} 768w, ${largeSrc} 1200w`}
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
    alt={alt}
    loading="lazy"
  />
);

export default ResponsiveImage;
