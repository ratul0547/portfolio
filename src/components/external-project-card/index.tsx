import { Fragment, useState } from 'react';
import LazyImage from '../lazy-image';
import { RiComputerLine } from 'react-icons/ri';
import { skeleton } from '../../utils';
import { SanitizedExternalProject } from '../../interfaces/sanitized-config';

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
  const [expandedImageIndex, setExpandedImageIndex] = useState<number | null>(
    null,
  );

  const closeAll = () => {
    setFlippedIndex(null);
    setExpandedImageIndex(null);
  };

  const renderSkeleton = () => {
    const array = [];
    for (let index = 0; index < externalProjects.length; index++) {
      array.push(
        <div className="card shadow-md card-sm bg-base-100 h-64" key={index}>
          <div className="p-8 h-full w-full">
            <div className="flex items-center flex-col">
              <div className="w-full">
                <div className="flex items-start px-4">
                  <div className="w-full">
                    <h2>
                      {skeleton({
                        widthCls: 'w-32',
                        heightCls: 'h-8',
                        className: 'mb-2 mx-auto',
                      })}
                    </h2>
                    <div className="avatar w-full h-full">
                      <div className="w-24 h-24 mask mask-squircle mx-auto">
                        {skeleton({
                          widthCls: 'w-full',
                          heightCls: 'h-full',
                          shape: '',
                        })}
                      </div>
                    </div>
                    <div className="mt-2">
                      {skeleton({
                        widthCls: 'w-full',
                        heightCls: 'h-4',
                        className: 'mx-auto',
                      })}
                    </div>
                    <div className="mt-2 flex items-center flex-wrap justify-center">
                      {skeleton({
                        widthCls: 'w-full',
                        heightCls: 'h-4',
                        className: 'mx-auto',
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
      );
    }

    return array;
  };

  const renderExternalProjects = () => {
    return externalProjects.map((item, index) => (
      <div
        className={`card shadow-md card-sm bg-base-100 flip-card z-hover h-72 ${
          flippedIndex === index ? 'flipped' : ''
        }`}
        key={index}
        tabIndex={0}
        onClick={(event) => {
          event.stopPropagation();
          setExpandedImageIndex(null);
          setFlippedIndex((currentIndex) =>
            currentIndex === index ? null : index,
          );
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setExpandedImageIndex(null);
            setFlippedIndex((currentIndex) =>
              currentIndex === index ? null : index,
            );
          }
        }}
      >
        <div className="flip-card-inner">
          {/* Front: project title and short description */}
          <div className="flip-card-front bg-base-100 rounded-2xl flex flex-col items-center justify-center p-8">
            <h2 className="font-medium text-center opacity-70 text-lg mb-3">
              {item.title}
            </h2>
            <p className="project-short-description text-base-content text-sm text-center opacity-80">
              {item.shortDescription || item.description || ''}
            </p>
          </div>
          {/* Back: screenshot and long description */}
          <div className="flip-card-back bg-base-200 rounded-2xl flex flex-col items-center justify-center p-8 overflow-y-auto">
            {item.imageUrl && (
              <button
                type="button"
                className="avatar opacity-90 mb-3 transition-transform duration-300 hover:scale-105 focus:scale-105"
                onClick={(event) => {
                  event.stopPropagation();
                  setExpandedImageIndex(index);
                }}
                aria-label={`Enlarge screenshot for ${item.title}`}
              >
                <div className="w-24 h-24 mask mask-squircle">
                  <LazyImage
                    src={item.imageUrl}
                    alt={'thumbnail'}
                    placeholder={skeleton({
                      widthCls: 'w-full',
                      heightCls: 'h-full',
                      shape: '',
                    })}
                  />
                </div>
              </button>
            )}
            <p className="text-base-content text-left text-sm">
              {item.longDescription || item.description || ''}
            </p>
          </div>
        </div>

        {item.imageUrl && (
          <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 transition-all duration-300 ${
              expandedImageIndex === index
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none'
            }`}
            onClick={closeAll}
          >
            <div
              className={`w-full max-w-5xl transition-transform duration-300 ${
                expandedImageIndex === index ? 'scale-100' : 'scale-95'
              }`}
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <LazyImage
                src={item.imageUrl}
                alt={`${item.title} screenshot`}
                className="w-full max-h-[88vh] object-contain rounded-2xl shadow-2xl"
                placeholder={skeleton({
                  widthCls: 'w-full',
                  heightCls: 'h-96',
                  shape: 'rounded-2xl',
                })}
              />
            </div>
          </div>
        )}
      </div>
    ));
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
