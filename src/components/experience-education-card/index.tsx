import { Fragment } from 'react';
import {
  SanitizedEducation,
  SanitizedExperience,
} from '../../interfaces/sanitized-config';
import { skeleton } from '../../utils';

const MONTHS: Record<string, number> = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
  july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
};

const parseDateToSortKey = (dateStr: string): number => {
  const lower = dateStr.toLowerCase().trim();
  for (const [monthName, monthNum] of Object.entries(MONTHS)) {
    if (lower.includes(monthName)) {
      const yearMatch = lower.match(/\d{4}/);
      const year = yearMatch ? parseInt(yearMatch[0]) : 0;
      return year * 100 + monthNum;
    }
  }
  const yearMatch = lower.match(/\d{4}/);
  if (yearMatch) return parseInt(yearMatch[0]) * 100;
  return 0;
};

const isPresent = (dateStr: string): boolean => {
  const lower = dateStr.toLowerCase().trim();
  return lower === 'present' || lower === 'current' || lower === 'now';
};

type EventKind = 'exp-start' | 'exp-end' | 'edu-start' | 'edu-end';

interface TimelineEvent {
  sortKey: number;
  dateStr: string;
  kind: EventKind;
  title: string;
  subtitle: string;
  link?: string;
}

const dotStyle = (kind: EventKind): string => {
  if (kind === 'exp-start' || kind === 'exp-end')
    return 'bg-orange-400 ring-2 ring-orange-200';
  return 'bg-blue-500 ring-2 ring-blue-200';
};

const lineStyle = (current: EventKind, next: EventKind): string => {
  const curIsExp = current === 'exp-start' || current === 'exp-end';
  const nextIsExp = next === 'exp-start' || next === 'exp-end';
  if (curIsExp && nextIsExp) return 'bg-orange-400';
  if (!curIsExp && !nextIsExp) return 'bg-blue-500';
  return 'bg-gradient-to-b from-orange-400 to-blue-500';
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
  const events: TimelineEvent[] = [];

  experiences.forEach((exp) => {
    events.push({
      sortKey: parseDateToSortKey(exp.from),
      dateStr: exp.from,
      kind: 'exp-start',
      title: exp.position ? `Joined as ${exp.position}` : 'Started working',
      subtitle: exp.company || '',
      link: exp.companyLink,
    });
    if (!isPresent(exp.to)) {
      events.push({
        sortKey: parseDateToSortKey(exp.to),
        dateStr: exp.to,
        kind: 'exp-end',
        title: `Left ${exp.company || 'role'}`,
        subtitle: exp.position || '',
        link: exp.companyLink,
      });
    }
  });

  educations.forEach((edu) => {
    events.push({
      sortKey: parseDateToSortKey(edu.from),
      dateStr: edu.from,
      kind: 'edu-start',
      title: `Enrolled at ${edu.institution || 'school'}`,
      subtitle: edu.degree || '',
    });
    events.push({
      sortKey: parseDateToSortKey(edu.to),
      dateStr: edu.to,
      kind: 'edu-end',
      title: `Completed ${edu.degree || 'degree'}`,
      subtitle: edu.institution || '',
    });
  });

  // Most recent first
  events.sort((a, b) => b.sortKey - a.sortKey);

  const renderSkeleton = () =>
    Array.from({ length: 4 }, (_, i) => (
      <div key={i} className="flex items-start gap-3">
        <div className="flex flex-col items-center self-stretch flex-shrink-0 pt-1">
          <div className="w-3 h-3 rounded-full bg-base-300 opacity-30" />
          {i < 3 && (
            <div className="w-0.5 flex-1 min-h-8 bg-base-300 opacity-20" />
          )}
        </div>
        <div className="pb-6">
          {skeleton({ widthCls: 'w-20', heightCls: 'h-3', className: 'mb-1' })}
          {skeleton({ widthCls: 'w-44', heightCls: 'h-4', className: 'mb-1' })}
          {skeleton({ widthCls: 'w-32', heightCls: 'h-3' })}
        </div>
      </div>
    ));

  return (
    <div className="card shadow-lg card-sm bg-base-100">
      <div className="card-body">
        {/* Header */}
        <div className="mx-3 mb-2">
          <h5 className="card-title">
            {loading ? (
              skeleton({ widthCls: 'w-24', heightCls: 'h-8' })
            ) : (
              <span className="text-base-content opacity-70">Timeline</span>
            )}
          </h5>
        </div>

        {/* Timeline */}
        <div className="mx-3 text-base-content text-sm">
          {loading ? (
            renderSkeleton()
          ) : (
            <Fragment>
              {events.map((event, i) => {
                const nextEvent = events[i + 1];
                return (
                  <div key={i} className="flex items-start gap-3">
                    {/* Dot + connector */}
                    <div className="flex flex-col items-center self-stretch flex-shrink-0 pt-1">
                      <div
                        className={`w-3 h-3 rounded-full flex-shrink-0 ${dotStyle(event.kind)}`}
                      />
                      {nextEvent && (
                        <div
                          className={`w-0.5 flex-1 min-h-6 ${lineStyle(event.kind, nextEvent.kind)}`}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="pb-5">
                      <div className="text-xs opacity-50 leading-none mb-0.5">
                        {event.dateStr}
                      </div>
                      <div className="font-semibold leading-tight">
                        {event.link ? (
                          <a
                            href={event.link}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline"
                          >
                            {event.title}
                          </a>
                        ) : (
                          event.title
                        )}
                      </div>
                      {event.subtitle && (
                        <div className="opacity-60 text-xs mt-0.5">
                          {event.subtitle}
                        </div>
                      )}
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
