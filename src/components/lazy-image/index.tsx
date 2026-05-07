import { useState, Fragment, useEffect } from 'react';

const normalizeImageSrc = (rawSrc: string): string => {
  if (
    /^(https?:)?\/\//.test(rawSrc) ||
    rawSrc.startsWith('data:') ||
    rawSrc.startsWith('blob:')
  ) {
    return rawSrc;
  }

  let normalizedSrc = rawSrc.replace(/^\/?public\//, '/');
  const baseUrl = import.meta.env.BASE_URL || '/';

  if (baseUrl !== '/') {
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    if (normalizedSrc.startsWith('/')) {
      if (!normalizedSrc.startsWith(baseUrl)) {
        normalizedSrc = `${cleanBase}${normalizedSrc}`;
      }
    } else {
      normalizedSrc = `${cleanBase}/${normalizedSrc}`;
    }
  }

  return normalizedSrc;
};

/**
 * LazyImage component.
 *
 * @param {string} placeholder The placeholder image URL.
 * @param {string} src The image URL.
 * @param {string} alt The alt text for the image.
 * @param {object} rest Additional props for the image element.
 *
 * @returns {ReactElement} The LazyImage component.
 */
const LazyImage: React.FC<{
  placeholder: React.ReactElement;
  src: string;
  alt: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}> = ({ placeholder, src, alt, ...rest }): React.ReactElement => {
  const [loading, setLoading] = useState(true);
  const resolvedSrc = normalizeImageSrc(src);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const imageToLoad = new Image();
    imageToLoad.onload = () => {
      if (isMounted) {
        setLoading(false);
      }
    };
    imageToLoad.onerror = () => {
      if (isMounted) {
        setLoading(false);
      }
    };
    imageToLoad.src = resolvedSrc;

    if (imageToLoad.complete) {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [resolvedSrc]);

  return (
    <Fragment>
      {loading ? placeholder : <img src={resolvedSrc} alt={alt} {...rest} />}
    </Fragment>
  );
};

export default LazyImage;
