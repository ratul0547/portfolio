import { useEffect } from 'react';
import { skeleton } from '../../utils';

const CredlyBadge = ({ loading }: { loading: boolean }) => {
  useEffect(() => {
    if (loading) return;

    // Remove any stale Credly script so it re-initializes against the now-visible div
    const existing = document.querySelector(
      'script[src="//cdn.credly.com/assets/utilities/embed.js"]',
    );
    if (existing) existing.parentNode?.removeChild(existing);

    const script = document.createElement('script');
    script.src = '//cdn.credly.com/assets/utilities/embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [loading]);

  return (
    <div className="card shadow-lg card-sm bg-base-100">
      <div className="card-body items-center">
        {loading ? (
          skeleton({ widthCls: 'w-full', heightCls: 'h-52' })
        ) : (
          <div className="overflow-hidden rounded-xl border border-base-300 flex justify-center w-full">
            <div
              data-iframe-width="300"
              data-iframe-height="270"
              data-share-badge-id="4e8650c9-d7a4-4132-bd26-89c2b6dc8011"
              data-share-badge-host="https://www.credly.com"
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CredlyBadge;
