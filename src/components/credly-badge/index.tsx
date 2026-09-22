import { useEffect } from 'react';
import { skeleton } from '../../utils';

const CredlyBadge = ({ loading }: { loading: boolean }) => {
  const badgeIds = [
    '68159c7c-e970-4aca-86ba-a5219f77a900',
    '157977e7-b646-456b-b071-6881752efc1e',
    '4e8650c9-d7a4-4132-bd26-89c2b6dc8011',
  ];

  useEffect(() => {
    if (loading) return;

    const existing = document.querySelector(
      'script[src="//cdn.credly.com/assets/utilities/embed.js"]',
    );
    if (existing) {
      existing.parentNode?.removeChild(existing);
    }

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
          <div className="flex flex-col items-center gap-4 w-full">
            {badgeIds.map((badgeId) => (
              <div
                key={badgeId}
                className="overflow-hidden rounded-xl border border-base-300 inline-block"
              >
                <div
                  data-iframe-width="300"
                  data-iframe-height="270"
                  data-share-badge-id={badgeId}
                  data-share-badge-host="https://www.credly.com"
                ></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CredlyBadge;
