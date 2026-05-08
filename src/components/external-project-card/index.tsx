import { Fragment, useState } from 'react';
import LazyImage from '../lazy-image';
import { RiComputerLine } from 'react-icons/ri';
import { skeleton } from '../../utils';
import { SanitizedExternalProject } from '../../interfaces/sanitized-config';

const SKILL_BADGE_MAPPINGS: Array<{ badgeClass: string; keywords: string[] }> =
  [
    {
      badgeClass: 'badge-error',
      keywords: [
        'security',
        'privacy',
        'encryption',
        'identity',
        'password',
        'malware',
      ],
    },
    {
      badgeClass: 'badge-success',
      keywords: [
        'network',
        'dns',
        'vpn',
        'wireguard',
        'mesh',
        'connectivity',
        'tunnel',
        'remote access',
      ],
    },
    {
      badgeClass: 'badge-info',
      keywords: ['virtualization', 'virtual', 'proxmox', 'hypervisor'],
    },
    {
      badgeClass: 'badge-accent',
      keywords: ['cloud', 'self-host', 'hosting'],
    },
    {
      badgeClass: 'badge-secondary',
      keywords: [
        'storage',
        'backup',
        'sync',
        'dedup',
        'file',
        'redundancy',
        'infrastructure',
      ],
    },
    {
      badgeClass: 'badge-primary',
      keywords: ['server', 'service', 'mail', 'linux'],
    },
    {
      badgeClass: 'badge-warning',
      keywords: ['automation', 'deployment'],
    },
    {
      badgeClass: 'badge-violet',
      keywords: [
        'management',
        'documentation',
        'workflow',
        'tracking',
        'collaboration',
        'communication',
        'administration',
      ],
    },
    {
      badgeClass: 'badge-orange',
      keywords: ['recovery', 'availability', 'troubleshoot'],
    },
  ];

const getSkillBadgeClass = (skill: string): string => {
  const normalizedSkill = skill.toLowerCase();
  const mapping = SKILL_BADGE_MAPPINGS.find(({ keywords }) =>
    keywords.some((keyword) => normalizedSkill.includes(keyword)),
  );

  return mapping?.badgeClass || 'badge-ghost';
};

const ExternalProjectCard = ({
  externalProjects,
  header,
  loading,
}: {
  externalProjects: SanitizedExternalProject[];
  header: string;
  loading: boolean;
}) => {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  const closeAll = () => {
    setFlippedIndex(null);
  };

  const renderSkeleton = () => {
    const array = [];
    for (let index = 0; index < externalProjects.length; index++) {
      array.push(
        <div className="card shadow-md card-sm bg-base-100 h-72" key={index}>
          <div className="p-6 h-full w-full">
            <div className="h-full flex flex-col">
              <div className="mb-3">
                {skeleton({
                  widthCls: 'w-40',
                  heightCls: 'h-6',
                  className: 'mx-auto',
                })}
              </div>
              <div className="flex-1 rounded-xl overflow-hidden">
                {skeleton({
                  widthCls: 'w-full',
                  heightCls: 'h-full',
                  shape: 'rounded-xl',
                })}
              </div>
            </div>
          </div>
        </div>,
      );
    }

    return array;
  };

  const renderExternalProjects = () => {
    return externalProjects.map((item, index) => {
      const hasImage = !!item.imageUrl;

      return (
        <div
          className={`card shadow-md card-sm bg-base-100 flip-card z-hover h-72 ${
            flippedIndex === index ? 'flipped' : ''
          }`}
          key={index}
          tabIndex={0}
          onClick={(event) => {
            event.stopPropagation();
            setFlippedIndex((currentIndex) =>
              currentIndex === index ? null : index,
            );
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              setFlippedIndex((currentIndex) =>
                currentIndex === index ? null : index,
              );
            }
          }}
        >
          <div className="flip-card-inner">
            {/* Front: title + image OR description */}
            <div className="flip-card-front bg-base-100 rounded-2xl flex flex-col p-6">
              <div className="flex items-center justify-center gap-2 mb-3 shrink-0">
                <span className="text-lg">{item.icon || '🛠️'}</span>
                <h2 className="font-medium text-center opacity-70 text-lg">
                  {item.title}
                </h2>
              </div>
              {hasImage ? (
                <div className="w-full flex-1 min-h-0 opacity-90 transition-transform duration-300 hover:scale-[1.01] rounded-xl">
                  <div className="w-full h-full rounded-xl overflow-hidden bg-base-200">
                    <LazyImage
                      src={item.imageUrl || ''}
                      alt={`${item.title} Screenshot`}
                      className="w-full h-full object-cover object-top rounded-xl"
                      placeholder={skeleton({
                        widthCls: 'w-full',
                        heightCls: 'h-full',
                        shape: 'rounded-xl',
                      })}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-base-content text-left text-sm opacity-80 overflow-y-auto">
                  {item.description || 'No description provided.'}
                </p>
              )}
            </div>
            {/* Back: description only when image exists, then keywords */}
            <div
              className="flip-card-back bg-base-200 rounded-2xl flex flex-col p-6 overflow-y-auto text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
              tabIndex={0}
            >
              <div className="flex items-center justify-center gap-2 mb-3 shrink-0">
                <span className="text-lg">{item.icon || '🛠️'}</span>
                <h2 className="font-medium text-center opacity-70 text-base">
                  {item.title}
                </h2>
              </div>
              {hasImage && (
                <p className="text-base-content text-left opacity-85 mb-4 rounded-2xl bg-base-100/60 p-3">
                  {item.description || 'No description provided.'}
                </p>
              )}
              {item.skillsDemonstrated && item.skillsDemonstrated.length > 0 ? (
                <ul className="flex flex-wrap gap-2">
                  {item.skillsDemonstrated.map((skill) => (
                    <li
                      key={`${item.title}-${skill}`}
                      className={`badge ${getSkillBadgeClass(skill)} badge-soft badge-theme-text badge-sm rounded-full font-bold transition-transform hover:scale-105`}
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <Fragment>
      <div
        className="col-span-1 lg:col-span-2"
        onClick={() => {
          closeAll();
        }}
      >
        <div className="card bg-base-200 shadow-xl border border-base-300">
          <div className="card-body p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div className="flex items-center space-x-3">
                {loading ? (
                  skeleton({
                    widthCls: 'w-12',
                    heightCls: 'h-12',
                    className: 'rounded-xl',
                  })
                ) : (
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl">
                    <RiComputerLine className="text-2xl" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-base-content truncate">
                    {loading
                      ? skeleton({ widthCls: 'w-40', heightCls: 'h-8' })
                      : header}
                  </h3>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading ? renderSkeleton() : renderExternalProjects()}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ExternalProjectCard;
