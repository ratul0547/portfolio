import React, { Fragment } from 'react';
import {
  SanitizedEducation,
  SanitizedExperience,
} from '../../interfaces/sanitized-config';
import { skeleton } from '../../utils';

const ExperienceItem = ({
  time,
  position,
  company,
  companyLink,
}: {
  time: React.ReactNode;
  position?: React.ReactNode;
  company?: React.ReactNode;
  companyLink?: string;
}) => (
  <div className="relative mb-5 text-right pr-4">
    <div
      className="absolute w-2 h-2 bg-base-300 rounded-full border border-base-300 mt-1.5"
      style={{ right: '-5px' }}
    ></div>
    <div className="my-0.5 text-xs">{time}</div>
    <h3 className="font-semibold">{position}</h3>
    <div className="mb-1 font-normal">
      {companyLink ? (
        <a href={companyLink} target="_blank" rel="noreferrer">
          {company}
        </a>
      ) : (
        company
      )}
    </div>
  </div>
);

const EducationItem = ({
  time,
  degree,
  institution,
}: {
  time: React.ReactNode;
  degree?: React.ReactNode;
  institution?: React.ReactNode;
}) => (
  <div className="relative mb-5 pl-4">
    <div
      className="absolute w-2 h-2 bg-base-300 rounded-full border border-base-300 mt-1.5"
      style={{ left: '-5px' }}
    ></div>
    <div className="my-0.5 text-xs">{time}</div>
    <h3 className="font-semibold">{degree}</h3>
    <div className="mb-1 font-normal">{institution}</div>
  </div>
);

const ExperienceEducationCard = ({
  experiences,
  educations,
  loading,
}: {
  experiences: SanitizedExperience[];
  educations: SanitizedEducation[];
  loading: boolean;
}) => {
  const renderSkeletonLeft = () => {
    const array = [];
    for (let index = 0; index < 2; index++) {
      array.push(
        <ExperienceItem
          key={index}
          time={skeleton({ widthCls: 'w-5/12', heightCls: 'h-4' })}
          position={skeleton({
            widthCls: 'w-6/12',
            heightCls: 'h-4',
            className: 'my-1.5',
          })}
          company={skeleton({ widthCls: 'w-6/12', heightCls: 'h-3' })}
        />,
      );
    }
    return array;
  };

  const renderSkeletonRight = () => {
    const array = [];
    for (let index = 0; index < 2; index++) {
      array.push(
        <EducationItem
          key={index}
          time={skeleton({ widthCls: 'w-5/12', heightCls: 'h-4' })}
          degree={skeleton({
            widthCls: 'w-6/12',
            heightCls: 'h-4',
            className: 'my-1.5',
          })}
          institution={skeleton({ widthCls: 'w-6/12', heightCls: 'h-3' })}
        />,
      );
    }
    return array;
  };

  return (
    <div className="card shadow-lg card-sm bg-base-100">
      <div className="card-body">
        <div className="mx-3 grid grid-cols-2 mb-2">
          <h5 className="card-title">
            {loading ? (
              skeleton({ widthCls: 'w-28', heightCls: 'h-8' })
            ) : (
              <span className="text-base-content opacity-70">Experience</span>
            )}
          </h5>
          <h5 className="card-title">
            {loading ? (
              skeleton({ widthCls: 'w-28', heightCls: 'h-8' })
            ) : (
              <span className="text-base-content opacity-70">Education</span>
            )}
          </h5>
        </div>
        <div className="relative mx-4 my-2 text-base-content">
          {/* Center vertical line */}
          <div
            className="absolute inset-y-0 border-l border-base-300 border-opacity-30"
            style={{ left: '50%' }}
          ></div>
          <div className="grid grid-cols-2">
            {/* Left side: Experience */}
            <div>
              {loading ? (
                renderSkeletonLeft()
              ) : (
                <Fragment>
                  {experiences.map((experience, index) => (
                    <ExperienceItem
                      key={index}
                      time={`${experience.from} - ${experience.to}`}
                      position={experience.position}
                      company={experience.company}
                      companyLink={experience.companyLink}
                    />
                  ))}
                </Fragment>
              )}
            </div>
            {/* Right side: Education */}
            <div>
              {loading ? (
                renderSkeletonRight()
              ) : (
                <Fragment>
                  {educations.map((education, index) => (
                    <EducationItem
                      key={index}
                      time={`${education.from} - ${education.to}`}
                      degree={education.degree}
                      institution={education.institution}
                    />
                  ))}
                </Fragment>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceEducationCard;
