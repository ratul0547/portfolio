import { skeleton } from '../../utils';

const CredlyBadge = ({ loading }: { loading: boolean }) => {
  const badgeIds = [
    '68159c7c-e970-4aca-86ba-a5219f77a900',
    '157977e7-b646-456b-b071-6881752efc1e',
    '4e8650c9-d7a4-4132-bd26-89c2b6dc8011',
  ];

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
                <iframe
                  title={`Credly badge ${badgeId}`}
                  src={`https://www.credly.com/badges/${badgeId}/embed`}
                  width="300"
                  height="270"
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CredlyBadge;
