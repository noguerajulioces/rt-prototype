import type { SVGProps } from "react";

export function RaceTrackerMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="RaceTracker"
      {...props}
    >
      <path
        d="M5 14 Q 20 4 35 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M10 20 Q 20 13 30 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M10 22 Q 20 29 30 22"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M5 28 Q 20 38 35 28"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function RaceTrackerLogo({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <span
      className={`inline-flex items-center gap-2 ${className ?? ""}`}
      style={{ color: "currentColor" }}
    >
      <RaceTrackerMark className="h-5 w-5" {...props} />
      <span className="font-extrabold tracking-tight text-base">
        RaceTracker
      </span>
    </span>
  );
}
