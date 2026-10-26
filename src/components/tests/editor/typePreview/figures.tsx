import { Skeleton } from '@heroui/react';

import { useGetMediaById } from '@/hooks/apis/media';

import type { Figure } from './samples';

// Placeholder artwork standing in for the group / question image_media_id

const Photo = () => (
  <svg
    viewBox="0 0 320 200"
    role="img"
    aria-label="Two people looking at a laptop in an office"
  >
    <rect width="320" height="200" fill="currentColor" opacity=".06" />
    <rect
      x="20"
      y="20"
      width="90"
      height="70"
      fill="none"
      stroke="currentColor"
      opacity=".3"
      strokeWidth="2"
    />
    <line
      x1="65"
      y1="20"
      x2="65"
      y2="90"
      stroke="currentColor"
      opacity=".3"
      strokeWidth="2"
    />
    <rect
      x="40"
      y="130"
      width="240"
      height="10"
      rx="3"
      fill="currentColor"
      opacity=".55"
    />
    <rect
      x="60"
      y="140"
      width="6"
      height="50"
      fill="currentColor"
      opacity=".45"
    />
    <rect
      x="254"
      y="140"
      width="6"
      height="50"
      fill="currentColor"
      opacity=".45"
    />
    <rect
      x="140"
      y="98"
      width="56"
      height="34"
      rx="3"
      fill="currentColor"
      opacity=".7"
    />
    <rect
      x="132"
      y="128"
      width="72"
      height="5"
      rx="2"
      fill="currentColor"
      opacity=".8"
    />
    <circle cx="100" cy="72" r="15" fill="currentColor" opacity=".7" />
    <path d="M76 130 q24 -50 48 0z" fill="currentColor" opacity=".55" />
    <circle cx="232" cy="70" r="15" fill="currentColor" opacity=".7" />
    <path d="M208 130 q24 -52 48 0z" fill="currentColor" opacity=".55" />
    <line
      x1="118"
      y1="104"
      x2="150"
      y2="112"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      opacity=".6"
    />
  </svg>
);

const DIAGRAM_MARKERS: [number, number, number][] = [
  [23, 180, 92],
  [24, 240, 104],
  [25, 300, 146],
];

const Diagram = () => (
  <svg
    viewBox="0 0 340 200"
    role="img"
    aria-label="Rainwater collection system with three numbered parts"
  >
    <path
      d="M30 70 L90 30 L150 70 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    <rect
      x="40"
      y="70"
      width="100"
      height="70"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M150 70 h30 v40"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
    />
    <rect
      x="166"
      y="110"
      width="28"
      height="22"
      rx="3"
      fill="currentColor"
      fillOpacity=".2"
      stroke="currentColor"
    />
    <path
      d="M180 132 v18 h30"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
    />
    <rect
      x="210"
      y="120"
      width="60"
      height="60"
      rx="6"
      fill="currentColor"
      fillOpacity=".12"
      stroke="currentColor"
      strokeWidth="2"
    />
    <rect
      x="212"
      y="150"
      width="56"
      height="28"
      fill="currentColor"
      opacity=".25"
    />
    <circle
      cx="300"
      cy="170"
      r="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M270 170 h18 M312 170 h18 v-40"
      stroke="currentColor"
      strokeWidth="3"
      fill="none"
    />
    <g fontSize="13" fontWeight="700">
      {DIAGRAM_MARKERS.map(([n, x, y]) => (
        <g key={n}>
          <circle cx={x} cy={y} r="11" className="fill-accent" />
          <text x={x} y={y + 4} textAnchor="middle" fill="#fff">
            {n}
          </text>
        </g>
      ))}
    </g>
    <text
      x="90"
      y="110"
      fontSize="11"
      textAnchor="middle"
      fill="currentColor"
      opacity=".7"
    >
      roof
    </text>
  </svg>
);

const MAP_PLACES: [string, number, number][] = [
  ['A', 60, 50],
  ['B', 120, 160],
  ['C', 230, 60],
  ['D', 290, 50],
  ['E', 60, 170],
  ['F', 205, 150],
];

const MapFigure = () => (
  <svg
    viewBox="0 0 340 220"
    role="img"
    aria-label="Park map with locations labelled A to F"
  >
    <rect
      x="6"
      y="6"
      width="328"
      height="208"
      rx="10"
      fill="currentColor"
      fillOpacity=".05"
      stroke="currentColor"
      strokeOpacity=".3"
    />
    <path
      d="M6 110 H334 M170 6 V214"
      stroke="currentColor"
      strokeOpacity=".35"
      strokeWidth="14"
    />
    <ellipse
      cx="255"
      cy="165"
      rx="50"
      ry="26"
      className="fill-accent"
      opacity=".25"
    />
    <text
      x="255"
      y="169"
      textAnchor="middle"
      fontSize="10"
      fill="currentColor"
      opacity=".7"
    >
      lake
    </text>
    <rect
      x="150"
      y="196"
      width="40"
      height="18"
      fill="currentColor"
      opacity=".5"
    />
    <text
      x="170"
      y="209"
      textAnchor="middle"
      fontSize="9"
      className="fill-surface"
    >
      GATE
    </text>
    <g fontSize="13" fontWeight="700" textAnchor="middle">
      {MAP_PLACES.map(([key, x, y]) => (
        <g key={key}>
          <rect
            x={x - 22}
            y={y - 16}
            width="44"
            height="30"
            rx="4"
            className="fill-surface"
            stroke="currentColor"
          />
          <text x={x} y={y + 4} fill="currentColor">
            {key}
          </text>
        </g>
      ))}
    </g>
    <text x="178" y="104" fontSize="9" fill="currentColor" opacity=".6">
      Main path
    </text>
  </svg>
);

const FIGURES: Record<Figure, () => React.JSX.Element> = {
  photo: Photo,
  diagram: Diagram,
  map: MapFigure,
};

type FigureImageProps = {
  figure?: Figure;
  mediaId?: number;
  className?: string;
};

const MediaImage = ({ mediaId }: { mediaId: number }) => {
  const { data: media } = useGetMediaById(mediaId);
  if (!media) return <Skeleton className="rounded-field aspect-video" />;
  return (
    <img
      src={media.url}
      alt=""
      className="border-border rounded-field w-full border object-contain"
    />
  );
};

// A real media id wins over the placeholder artwork
export const FigureImage = ({
  figure,
  mediaId,
  className,
}: FigureImageProps) => {
  if (mediaId)
    return (
      <figure className={className}>
        <MediaImage mediaId={mediaId} />
      </figure>
    );
  if (!figure) return null;
  const Svg = FIGURES[figure];
  return (
    <figure className={className}>
      <div className="border-border rounded-field border p-2">
        <Svg />
      </div>
      <figcaption className="text-muted mt-1 font-mono text-xs">
        image_media_id
      </figcaption>
    </figure>
  );
};
