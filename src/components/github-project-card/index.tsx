import { Fragment, useState } from 'react';
import { AiOutlineFork, AiOutlineStar, AiOutlineGithub } from 'react-icons/ai';
import { MdInsertLink } from 'react-icons/md';
import { getLanguageColor, skeleton } from '../../utils';
import { GithubProject } from '../../interfaces/github-project';

const GithubProjectCard = ({
  header,
  githubProjects,
  loading,
  limit,
}: {
  header: string;
  githubProjects: GithubProject[];
  loading: boolean;
  limit: number;
}) => {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  if (!loading && githubProjects.length === 0) {
    return;
  }

  const renderSkeleton = () => {
    const array = [];
    for (let index = 0; index < limit; index++) {
      array.push(
        <div className="card shadow-md card-sm bg-base-100 h-48" key={index}>
          <div className="flex justify-between flex-col p-8 h-full w-full">
            <div>
              <div className="flex items-center">
                <span>
                  <h5 className="card-title text-lg">
                    {skeleton({
                      widthCls: 'w-32',
                      heightCls: 'h-8',
                      className: 'mb-1',
                    })}
                  </h5>
                </span>
              </div>
              <div className="mb-5 mt-1">
                {skeleton({
                  widthCls: 'w-full',
                  heightCls: 'h-4',
                  className: 'mb-2',
                })}
                {skeleton({ widthCls: 'w-full', heightCls: 'h-4' })}
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex grow">
                <span className="mr-3 flex items-center">
                  {skeleton({ widthCls: 'w-12', heightCls: 'h-4' })}
                </span>
                <span className="flex items-center">
                  {skeleton({ widthCls: 'w-12', heightCls: 'h-4' })}
                </span>
              </div>
              <div>
                <span className="flex items-center">
                  {skeleton({ widthCls: 'w-12', heightCls: 'h-4' })}
                </span>
              </div>
            </div>
          </div>
        </div>,
      );
    }

    return array;
  };

  const renderProjects = () => {
    return githubProjects.map((item, index) => (
      <div
        className={`card shadow-md card-sm bg-base-100 flip-card z-hover h-56 ${
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
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setFlippedIndex((currentIndex) =>
              currentIndex === index ? null : index,
            );
          }
        }}
      >
        <div className="flip-card-inner">
          {/* Front: project name, short description and stats */}
          <div className="flip-card-front bg-base-100 rounded-2xl flex flex-col justify-between p-8">
            <div>
              <div className="flex items-center truncate">
                <div className="card-title text-lg tracking-wide flex text-base-content opacity-60">
                  <MdInsertLink className="my-auto" />
                  <span>{item.name}</span>
                </div>
              </div>
              <p className="project-short-description text-base-content text-left text-sm mt-2 opacity-80">
                {item.description
                  ? `${item.description.slice(0, 100)}${
                      item.description.length > 100 ? '...' : ''
                    }`
                  : 'No description provided.'}
              </p>
            </div>
            <div className="flex justify-between text-sm text-base-content truncate mt-4">
              <div className="flex grow">
                <span className="mr-3 flex items-center">
                  <AiOutlineStar className="mr-0.5" />
                  <span>{item.stargazers_count}</span>
                </span>
                <span className="flex items-center">
                  <AiOutlineFork className="mr-0.5" />
                  <span>{item.forks_count}</span>
                </span>
              </div>
              <div>
                <span className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-1 opacity-60"
                    style={{ backgroundColor: getLanguageColor(item.language) }}
                  />
                  <span>{item.language}</span>
                </span>
              </div>
            </div>
          </div>
          {/* Back: longer description */}
          <div className="flip-card-back bg-base-200 rounded-2xl flex items-center justify-center p-8 overflow-y-auto">
            <p className="text-base-content text-left text-sm">
              {item.description || 'No description provided.'}
            </p>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <Fragment>
      <div
        className="col-span-1 lg:col-span-2"
        onClick={() => {
          setFlippedIndex(null);
        }}
      >
        <div className="card bg-base-200 shadow-xl border border-base-300">
          <div className="card-body p-8">
            {/* Enhanced Header Section */}
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
                    <AiOutlineGithub className="text-2xl" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-base-content truncate">
                    {loading
                      ? skeleton({ widthCls: 'w-48', heightCls: 'h-8' })
                      : header}
                  </h3>
                  <div className="text-base-content/60 text-xs sm:text-sm mt-1 truncate">
                    {loading
                      ? skeleton({ widthCls: 'w-32', heightCls: 'h-4' })
                      : `Showcasing ${githubProjects.length} featured repositories`}
                  </div>
                </div>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading ? renderSkeleton() : renderProjects()}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default GithubProjectCard;
