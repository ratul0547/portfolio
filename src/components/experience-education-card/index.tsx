import {
  SanitizedEducation,
  SanitizedExperience,
} from '../../interfaces/sanitized-config';
import { skeleton } from '../../utils';

const MONTHS: Record<string, number> = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
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

type EventKind = 'experience' | 'education';

interface TimelineEntry {
  sortKey: number;
  from: string;
  to: string;
  kind: EventKind;
  title: string;
  subtitle: string;
  link?: string;
}

const ExperienceEducationCard = ({
  experiences,
  educations,
  loading,
}: {
  experiences: SanitizedExperience[];
  educations: SanitizedEducation[];
  loading: boolean;
}) => {
  const entries: TimelineEntry[] = [];

  experiences.forEach((exp) => {
    entries.push({
      sortKey: parseDateToSortKey(exp.from),
      from: exp.from,
      to: exp.to,
      kind: 'experience',
      title: exp.position || '',
      subtitle: exp.company || '',
      link: exp.companyLink,
    });
  });

  educations.forEach((edu) => {
    entries.push({
      sortKey: parseDateToSortKey(edu.from),
      from: edu.from,
      to: edu.to,
      kind: 'education',
      title: edu.degree || '',
      subtitle: edu.institution || '',
    });
  });

  // Most recent first
  entries.sort((a, b) => b.sortKey - a.sortKey);

  const eduEntries = entries.filter((e) => e.kind === 'education');
  const expEntries = entries.filter((e) => e.kind === 'experience');
  const rowCount = Math.max(eduEntries.length, expEntries.length);

  const renderSkeletonSide = () =>
    Array.from({ length: 2 }, (_, i) => (
      <div key={i} className="flex flex-col gap-0.5 py-4">
        {skeleton({ widthCls: 'w-20', heightCls: 'h-3', className: 'mb-1' })}
        {skeleton({ widthCls: 'w-32', heightCls: 'h-4', className: 'mb-1' })}
        {skeleton({ widthCls: 'w-24', heightCls: 'h-3' })}
      </div>
    ));

  const EntryContent = ({ entry }: { entry: TimelineEntry }) => (
    <div>
      <div className="text-xs opacity-50 leading-none mb-0.5">
        {entry.from} – {entry.to}
      </div>
      <div className="font-semibold leading-tight text-sm">
        {entry.link ? (
          <a
            href={entry.link}
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            {entry.title}
          </a>
        ) : (
          entry.title
        )}
      </div>
      {entry.subtitle && (
        <div className="opacity-60 text-xs mt-0.5">{entry.subtitle}</div>
      )}
    </div>
  );

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

        {/* Column labels */}
        {!loading && (
          <div className="flex items-center mx-3 mb-1 text-xs font-semibold opacity-50 uppercase tracking-wider">
            <div className="flex-1 text-right pr-4">Education</div>
            <div className="w-3" />
            <div className="flex-1 pl-4">Experience</div>
          </div>
        )}

        {/* Timeline */}
        <div className="mx-3 text-base-content">
          {loading ? (
            <div className="flex gap-3">
              <div className="flex-1">{renderSkeletonSide()}</div>
              <div className="flex flex-col items-center pt-5">
                {Array.from({ length: 2 }, (_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-base-300 opacity-30" />
                    {i < 1 && (
                      <div className="w-0.5 h-10 bg-base-300 opacity-20" />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex-1">{renderSkeletonSide()}</div>
            </div>
          ) : (
            <div className="relative flex">
              {/* Education column (left) */}
              <div className="flex-1 flex flex-col">
                {Array.from({ length: rowCount }, (_, i) => {
                  const entry = eduEntries[i];
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-end py-3 pr-4 min-h-[4rem]"
                    >
                      {entry && (
                        <div className="text-right">
                          <EntryContent entry={entry} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Center line + dots */}
              <div className="flex flex-col items-center relative">
                {/* Vertical line */}
                <div className="absolute top-0 bottom-0 w-0.5 bg-base-300 opacity-40 left-1/2 -translate-x-1/2" />
                {Array.from({ length: rowCount }, (_, i) => {
                  const eduEntry = eduEntries[i];
                  const expEntry = expEntries[i];
                  const hasEdu = !!eduEntry;
                  const hasExp = !!expEntry;
                  if (!hasEdu && !hasExp) return null;
                  const dotColor =
                    hasEdu && hasExp
                      ? 'bg-gradient-to-br from-blue-500 to-orange-400'
                      : hasEdu
                        ? 'bg-blue-500 ring-2 ring-blue-200'
                        : 'bg-orange-400 ring-2 ring-orange-200';
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-center relative z-10 min-h-[4rem]"
                    >
                      <div
                        className={`w-3 h-3 rounded-full flex-shrink-0 ${dotColor}`}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Experience column (right) */}
              <div className="flex-1 flex flex-col">
                {Array.from({ length: rowCount }, (_, i) => {
                  const entry = expEntries[i];
                  return (
                    <div
                      key={i}
                      className="flex items-center py-3 pl-4 min-h-[4rem]"
                    >
                      {entry && <EntryContent entry={entry} />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExperienceEducationCard;
