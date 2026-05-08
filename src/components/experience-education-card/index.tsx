import { Fragment, useRef, useState } from 'react';
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

const isPresent = (dateStr: string): boolean => {
  const lower = dateStr.toLowerCase().trim();
  return lower === 'present' || lower === 'current' || lower === 'now';
};

type EventKind = 'exp-start' | 'exp-end' | 'edu-start' | 'edu-end';
type TooltipPlacement = 'left' | 'right' | 'top' | 'bottom';

interface TimelineEvent {
  sortKey: number;
  dateStr: string;
  kind: EventKind;
  title: string;
  subtitle: string;
  link?: string;
  tooltipTitle?: string;
  tooltipDescription?: string;
  tooltipHighlights?: string[];
}

const isWork = (kind: EventKind) => kind === 'exp-start' || kind === 'exp-end';

const isEdu = (kind: EventKind) => kind === 'edu-start' || kind === 'edu-end';

const dotColor = (kind: EventKind): string => {
  if (isWork(kind)) return 'bg-orange-400 ring-2 ring-orange-200';
  return 'bg-blue-500 ring-2 ring-blue-200';
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
      tooltipTitle: exp.tooltipTitle,
      tooltipDescription: exp.tooltipDescription,
      tooltipHighlights: exp.tooltipHighlights,
    });
    if (!isPresent(exp.to)) {
      events.push({
        sortKey: parseDateToSortKey(exp.to),
        dateStr: exp.to,
        kind: 'exp-end',
        title: `Left ${exp.company || 'role'}`,
        subtitle: exp.position || '',
        link: exp.companyLink,
        tooltipTitle: exp.tooltipTitle,
        tooltipDescription: exp.tooltipDescription,
        tooltipHighlights: exp.tooltipHighlights,
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

  // Collect all unique sort keys across both sides
  const workEvents = events.filter((e) => isWork(e.kind));
  const eduEvents = events.filter((e) => isEdu(e.kind));

  // Build rows: each row has a sort key; left = education event, right = work event.
  // Every row is guaranteed to have at least one event since keys come from events.
  const allKeys = Array.from(new Set(events.map((e) => e.sortKey))).sort(
    (a, b) => b - a,
  );

  const rows = allKeys
    .map((key) => ({
      key,
      left: eduEvents.find((e) => e.sortKey === key) ?? null,
      right: workEvents.find((e) => e.sortKey === key) ?? null,
    }))
    .filter((row) => row.left !== null || row.right !== null);

  const triggerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const tooltipRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [tooltipPlacements, setTooltipPlacements] = useState<
    Record<string, TooltipPlacement>
  >({});
  const [tooltipMaxWidths, setTooltipMaxWidths] = useState<
    Record<string, number>
  >({});

  const setTriggerRef = (id: string, element: HTMLDivElement | null) => {
    triggerRefs.current[id] = element;
  };

  const setTooltipRef = (id: string, element: HTMLDivElement | null) => {
    tooltipRefs.current[id] = element;
  };

  const updateTooltipPosition = (id: string, align: 'left' | 'right') => {
    if (typeof window === 'undefined') return;

    const trigger = triggerRefs.current[id];
    const tooltip = tooltipRefs.current[id];
    if (!trigger || !tooltip) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const margin = 12;
    const triggerRect = trigger.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    const availableSpace: Record<TooltipPlacement, number> = {
      left: triggerRect.left - margin,
      right: viewportWidth - triggerRect.right - margin,
      top: triggerRect.top - margin,
      bottom: viewportHeight - triggerRect.bottom - margin,
    };

    const fits = (placement: TooltipPlacement) => {
      if (placement === 'left' || placement === 'right') {
        return tooltipRect.width <= availableSpace[placement];
      }
      return tooltipRect.height <= availableSpace[placement];
    };

    const preferredOrder: TooltipPlacement[] =
      viewportWidth < 768
        ? ['bottom', 'top', 'right', 'left']
        : align === 'right'
          ? ['left', 'right', 'top', 'bottom']
          : ['right', 'left', 'top', 'bottom'];

    const bestBySpace = Object.entries(availableSpace).sort(
      (a, b) => b[1] - a[1],
    )[0][0] as TooltipPlacement;
    const placement =
      preferredOrder.find((candidate) => fits(candidate)) ?? bestBySpace;

    const maxWidth =
      placement === 'left' || placement === 'right'
        ? Math.max(
            176,
            Math.min(320, availableSpace[placement] - 8, viewportWidth - 16),
          )
        : Math.max(176, Math.min(360, viewportWidth - 16));

    setTooltipPlacements((prev) =>
      prev[id] === placement ? prev : { ...prev, [id]: placement },
    );
    setTooltipMaxWidths((prev) =>
      prev[id] === maxWidth ? prev : { ...prev, [id]: maxWidth },
    );
  };

  const renderSkeleton = () =>
    Array.from({ length: 4 }, (_, i) => (
      <div
        key={i}
        className="grid grid-cols-[1fr_auto_1fr] gap-x-4 items-start"
      >
        <div className="flex flex-col items-end pb-6">
          {i % 2 === 0 && (
            <div className="text-right">
              {skeleton({
                widthCls: 'w-20',
                heightCls: 'h-3',
                className: 'mb-1 ml-auto',
              })}
              {skeleton({
                widthCls: 'w-32',
                heightCls: 'h-4',
                className: 'mb-1 ml-auto',
              })}
              {skeleton({
                widthCls: 'w-24',
                heightCls: 'h-3',
                className: 'ml-auto',
              })}
            </div>
          )}
        </div>
        <div className="flex flex-col items-center self-stretch">
          <div className="w-3 h-3 rounded-full bg-base-300 opacity-30 flex-shrink-0 mt-1" />
          {i < 3 && (
            <div className="w-0.5 flex-1 min-h-8 bg-base-300 opacity-20" />
          )}
        </div>
        <div className="pb-6">
          {i % 2 !== 0 && (
            <>
              {skeleton({
                widthCls: 'w-20',
                heightCls: 'h-3',
                className: 'mb-1',
              })}
              {skeleton({
                widthCls: 'w-32',
                heightCls: 'h-4',
                className: 'mb-1',
              })}
              {skeleton({ widthCls: 'w-24', heightCls: 'h-3' })}
            </>
          )}
        </div>
      </div>
    ));

  const renderContent = (event: TimelineEvent, align: 'left' | 'right') => {
    const hasTooltip = align === 'right' && !!event.tooltipTitle;
    const alignmentClass = align === 'left' ? 'text-right' : 'text-left';
    const containerClass = hasTooltip
      ? `${alignmentClass} group relative inline-block max-w-full hover:z-50 focus-within:z-50`
      : alignmentClass;
    const sanitizedTitle = event.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const tooltipId = hasTooltip
      ? `work-tooltip-${event.kind}-${event.sortKey}-${sanitizedTitle}`
      : undefined;
    const placement = hasTooltip
      ? (tooltipPlacements[tooltipId!] ??
        (align === 'right' ? 'left' : 'right'))
      : 'bottom';
    const placementClassName: Record<TooltipPlacement, string> = {
      left: 'right-full top-1/2 mr-3 -translate-y-1/2 translate-x-1 group-hover:translate-x-0 group-focus-within:translate-x-0',
      right:
        'left-full top-1/2 ml-3 -translate-y-1/2 -translate-x-1 group-hover:translate-x-0 group-focus-within:translate-x-0',
      top: 'left-1/2 bottom-full mb-2 -translate-x-1/2 translate-y-1 group-hover:translate-y-0 group-focus-within:translate-y-0',
      bottom:
        'left-1/2 top-full mt-2 -translate-x-1/2 -translate-y-1 group-hover:translate-y-0 group-focus-within:translate-y-0',
    };
    const tooltipClassName = [
      'pointer-events-none absolute z-50 rounded-xl border border-base-content/20 bg-base-100 p-3 shadow-xl',
      'w-72 md:w-80 opacity-0 transition-all duration-300 ease-out',
      'group-hover:opacity-100 group-focus-within:opacity-100',
      placementClassName[placement],
    ].join(' ');

    return (
      <div
        ref={
          tooltipId
            ? (element) => {
                setTriggerRef(tooltipId, element);
              }
            : undefined
        }
        className={containerClass}
        aria-describedby={tooltipId}
        tabIndex={hasTooltip ? 0 : undefined}
        onMouseEnter={
          tooltipId ? () => updateTooltipPosition(tooltipId, align) : undefined
        }
        onFocus={
          tooltipId ? () => updateTooltipPosition(tooltipId, align) : undefined
        }
        onTouchStart={
          tooltipId ? () => updateTooltipPosition(tooltipId, align) : undefined
        }
      >
        <div className="text-xs opacity-50 leading-none mb-0.5">
          {event.dateStr}
        </div>
        <div className="font-semibold leading-tight text-sm">
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
          <div className="opacity-60 text-xs mt-0.5">{event.subtitle}</div>
        )}
        {hasTooltip && (
          <div
            ref={(element) => setTooltipRef(tooltipId!, element)}
            id={tooltipId}
            role="tooltip"
            className={tooltipClassName}
            style={{ maxWidth: `${tooltipMaxWidths[tooltipId!] ?? 320}px` }}
          >
            <div className="text-xs font-semibold leading-snug mb-1">
              {event.tooltipTitle}
            </div>
            {event.tooltipDescription && (
              <div className="text-xs opacity-80 leading-snug mb-2">
                {event.tooltipDescription}
              </div>
            )}
            {event.tooltipHighlights && event.tooltipHighlights.length > 0 && (
              <ul className="list-disc pl-4 space-y-1 text-xs opacity-90 leading-snug">
                {event.tooltipHighlights.map((item, index) => (
                  <li key={`${event.sortKey}-${index}`}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    );
  };

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
          {!loading && (
            <div className="flex gap-6 mt-1 text-xs opacity-50">
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
                Education
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-orange-400" />
                Work
              </span>
            </div>
          )}
        </div>

        {/* Split Timeline */}
        <div className="mx-3 text-base-content text-sm">
          {loading ? (
            renderSkeleton()
          ) : (
            <Fragment>
              {rows.map((row, i) => {
                const isLast = i === rows.length - 1;
                const dotKind = (row.left ?? row.right)!.kind;
                return (
                  <div
                    key={row.key}
                    className="grid grid-cols-[1fr_auto_1fr] gap-x-3 items-start"
                  >
                    {/* Left: Education */}
                    <div className="pb-5 flex justify-end pt-0.5">
                      {row.left ? renderContent(row.left, 'left') : null}
                    </div>

                    {/* Centre: dot + line */}
                    <div className="flex flex-col items-center self-stretch">
                      <div
                        className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${dotColor(dotKind)}`}
                      />
                      {!isLast && (
                        <div className="w-0.5 flex-1 min-h-6 bg-base-content opacity-30" />
                      )}
                    </div>

                    {/* Right: Work */}
                    <div className="pb-5 pt-0.5">
                      {row.right ? renderContent(row.right, 'right') : null}
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
