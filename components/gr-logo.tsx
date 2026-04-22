type Props = {
  className?: string;
  /** 视口 CSS 像素边长，默认 36 */
  size?: number;
};

/**
 * 品牌图标：高圆角方框、暖灰底 + 浅色字「GR」，与页面纸色背景协调。
 */
export function GrLogo({ className = "", size = 36 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={`shrink-0 ${className}`}
      aria-hidden
    >
      <rect
        width="40"
        height="40"
        rx="14"
        ry="14"
        className="fill-[var(--logo-mark-bg)] stroke-[var(--logo-mark-ring)]"
        strokeWidth="1"
      />
      <text
        x="20"
        y="20"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-[var(--logo-mark-fg)]"
        fontSize="17"
        fontWeight="600"
        fontFamily="var(--font-noto-sc), ui-sans-serif, system-ui, sans-serif"
        letterSpacing="0.02em"
      >
        GR
      </text>
    </svg>
  );
}
