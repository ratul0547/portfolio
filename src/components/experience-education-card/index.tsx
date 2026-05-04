import { Fragment } from 'react';
import {
  SanitizedEducation,
  SanitizedExperience,
} from '../../interfaces/sanitized-config';
import { skeleton } from '../../utils';

const extractYear = (dateStr: string): number => {
  const match = dateStr.match(/\d{4}/);
  return match ? parseInt(match[0]) : 0;
};

interface TimelineEntry {
  year: number;
  experiences: SanitizedExperience[];
  educations: SanitizedEducation[];
}

type SegmentType = 'experience' | 'education' | 'both' | 'none';

const DOT_EXP = 'bg-orange-400 text-white ring-2 ring-orange-200';
const DOT_EDU = 'bg-blue-500 text-white ring-2 ring-blue-200';
const DOT_BOTH = 'bg-purple-500 text-white ring-2 ring-purple-200';
const DOT_NONE = 'bg-base-300 text-base-content ring-2 ring-base-200';

const LINE_EXP = 'bg-orange-400';
const LINE_EDU = 'bg-blue-500';
const LINE_BOTH = 'bg-gradient-to-b from-orange-400 to-blue-500';
const LINE_NONE = 'bg-base-300 opacity-30';

const dotClass = (exp: number, edu: number) => {
  if (exp > 0 && edu > 0) return DOT_BOTH;
  if (exp > 0) return DOT_EXP;
  if (edu > 0) return DOT_EDU;
  return DOT_NONE;
};

const lineClass = (type: SegmentType) => {
  if (type === 'both') return LINE_BOTH;
  if (type === 'experience') return LINE_EXP;
  if (type === 'education') return LINE_EDU;
  return LINE_NONE;
};

const segmentType = (
  upperYear: number,
  lowerYear: number,
  experiences: SanitizedExperience[],
  educations: SanitizedEducation[],
): SegmentType => {
  const expActive = experiences.some((e) => {
    const from = extractYear(e.from);
    const to = extractYear(e.to);
    return from <= upperYear && to >= lowerYear;
  });
  const eduActive = educations.some((e) => {
    const from = extractYear(e.from);
    const to = extractYear(e.to);
    return from <= upperYear && to >= lowerYear;
  });
  if (expActive && eduActive) return 'both';
  if (expActive) return 'experience';
  if (eduActive) return 'education';
  return 'none';
};

const ExperienceEducationCard = ({
  experiences,
  educations,
  loading,
}: {
  experiences: SanitizedExperience[];
  educations: SanitizedEducation[];
  loading: boolean;
}) => {
  // Build year-keyed entries from "from" years
  const yearMap = new Map<number, TimelineEntry>();
  experiences.forEach((exp) => {
    const year = extractYear(exp.from);
    if (!yearMap.has(year))
      yearMap.set(year, { year, experiences: [], educations: [] });
    yearMap.get(year)!.experiences.push(exp);
  });
  educations.forEach((edu) => {
    const year = extractYear(edu.from);
    if (!yearMap.has(year))
      yearMap.set(year, { year, experiences: [], educations: [] });
    yearMap.get(year)!.educations.push(edu);
  });

  const entries: TimelineEntry[] = Array.from(yearMap.values()).sort(
    (a, b) => b.year - a.year,
  );

  const renderSkeleton = () =>
    Array.from({ length: 3 }, (_, i) => (
      <div key={i} className="flex items-start gap-0">
        <div className="flex-1 pr-4 text-right pb-8">
          {skeleton({ widthCls: 'w-24', heightCls: 'h-4', className: 'ml-auto mb-1' })}
          {skeleton({ widthCls: 'w-32', heightCls: 'h-4', className: 'ml-auto mb-1' })}
          {skeleton({ widthCls: 'w-28', heightCls: 'h-3', className: 'ml-auto' })}
        </div>
        <div className="flex flex-col items-center self-stretch flex-shrink-0 w-16">
          <div className="w-12 h-8 rounded-full bg-base-300 opacity-30" />
          {i < 2 && <div className="w-0.5 flex-1 min-h-8 bg-base-300 opacity-20" />}
        </div>
        <div className="flex-1 pl-4 pb-8">
          {skeleton({ widthCls: 'w-24', heightCls: 'h-4', className: 'mb-1' })}
          {skeleton({ widthCls: 'w-32', heightCls: 'h-4', className: 'mb-1' })}
          {skeleton({ widthCls: 'w-28', heightCls: 'h-3' })}
        </div>
      </div>
    ));

  return (
    <div className="card shadow-lg card-sm bg-base-100">
      <div className="card-body">
        {/* Header */}
        <div className="mx-3 mb-1 grid grid-cols-[1fr_4rem_1fr]">
          <h5 className="card-title justify-end">
            {loading ? (
              skeleton({ widthCls: 'w-24', heightCls: 'h-8' })
            ) : (
              <span className="text-base-content opacity-70">Experience</span>
            )}
          </h5>
          <div />
          <h5 className="card-title">
            {loading ? (
              skeleton({ widthCls: 'w-24', heightCls: 'h-8' })
            ) : (
              <span className="text-base-content opacity-70">Education</span>
            )}
          </h5>
        </div>

        {/* Legend */}
        {!loading && (
          <div className="flex gap-4 mx-3 mb-3 text-xs text-base-content opacity-60">
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-full bg-orange-400" />
              Experience
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-full bg-blue-500" />
              Education
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-full bg-purple-500" />
              Both
            </span>
          </div>
        )}

        {/* Timeline */}
        <div className="mx-3 text-base-content text-sm">
          {loading ? (
            renderSkeleton()
          ) : (
            <Fragment>
              {entries.map((entry, i) => {
                const nextEntry = entries[i + 1];
                const segType = nextEntry
                  ? segmentType(entry.year, nextEntry.year, experiences, educations)
                  : 'none';

                return (
                  <div key={entry.year} className="flex items-start">
                    {/* Left: Experience items */}
                    <div className="flex-1 pr-3 text-right pb-6">
                      {entry.experiences.map((exp, j) => (
                        <div key={j} className="mb-3 last:mb-0">
                          <div className="text-xs opacity-60">
                            {exp.from} – {exp.to}
                          </div>
                          <div className="font-semibold leading-tight mt-0.5">
                            {exp.position}
                          </div>
                          <div className="opacity-70">
                            {exp.companyLink ? (
                              <a
                                href={exp.companyLink}
                                target="_blank"
                                rel="noreferrer"
                                className="hover:underline"
                              >
                                {exp.company}
                              </a>
                            ) : (
                              exp.company
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Center: year dot + connector line */}
                    <div className="flex flex-col items-center self-stretch flex-shrink-0 w-16">
                      <div
                        className={`w-12 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 ${dotClass(entry.experiences.length, entry.educations.length)}`}
                      >
                        {entry.year}
                      </div>
                      {nextEntry && (
                        <div
                          className={`w-0.5 flex-1 min-h-8 ${lineClass(segType)}`}
                        />
                      )}
                    </div>

                    {/* Right: Education items */}
                    <div className="flex-1 pl-3 pb-6">
                      {entry.educations.map((edu, j) => (
                        <div key={j} className="mb-3 last:mb-0">
                          <div className="text-xs opacity-60">
                            {edu.from} – {edu.to}
                          </div>
                          <div className="font-semibold leading-tight mt-0.5">
                            {edu.degree}
                          </div>
                          <div className="opacity-70">{edu.institution}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExperienceEducationCard;
