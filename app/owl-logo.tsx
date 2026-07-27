/**
 * ownspce brand mark — geometric owl, transparent (no plate or shadow).
 * Locked artwork from the design system.
 * @param size - Rendered width and height in pixels (default 48)
 */
export default function OwlLogo({ size = 48 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 140 140"
      role="img"
      aria-label="ownspce owl logo"
    >
      <path d="M42 44 L36 27 L53 40 Z" fill="#1A1A1A" />
      <path d="M98 44 L104 27 L87 40 Z" fill="#1A1A1A" />
      <ellipse cx="70" cy="83" rx="46" ry="50" fill="#1A1A1A" />
      <circle cx="55" cy="74" r="15" fill="#FFFFFF" />
      <circle cx="85" cy="74" r="15" fill="#FFFFFF" />
      <circle cx="55" cy="74" r="7.5" fill="#1A1A1A" />
      <circle cx="85" cy="74" r="7.5" fill="#1A1A1A" />
      <path d="M70 84 L63.5 94 L76.5 94 Z" fill="#CC785C" />
    </svg>
  );
}
