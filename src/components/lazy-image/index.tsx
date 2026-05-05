import { useState, Fragment, useEffect } from 'react';

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
    imageToLoad.src = src;

    if (imageToLoad.complete) {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [src]);

  return (
    <Fragment>
      {loading ? placeholder : <img src={src} alt={alt} {...rest} />}
    </Fragment>
  );
};

export default LazyImage;
