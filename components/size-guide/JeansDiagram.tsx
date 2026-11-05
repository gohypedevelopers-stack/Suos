import { cn } from "@/lib/utils"

/**
 * Flat line drawing of a pair of jeans with the measurement points used in the
 * size chart (Waist, Hip, Inseam, Full Length, Bottom Opening). `compact` keeps
 * only Waist and Hip, as in the product-page size chart.
 */
export function JeansDiagram({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 260 420"
      role="img"
      aria-label="How each measurement is taken: waist, hip, inseam, full length and bottom opening"
      className={cn("h-auto w-full text-black", className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <marker id="jeans-arrow" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0 0 L8 4 L0 8 z" fill="currentColor" stroke="none" />
        </marker>
      </defs>

      {/* Garment */}
      <g strokeWidth="1.1">
        {/* Waistband */}
        <path d="M70 46 H190 V60 H70 Z" />
        {/* Belt loops */}
        <path d="M80 44 V62 M108 44 V62 M152 44 V62 M180 44 V62" strokeWidth="0.9" />
        {/* Button */}
        <circle cx="134" cy="53" r="2.6" />
        {/* Legs: outer seam, hem, inseam, crotch, inseam, hem, outer seam */}
        <path d="M70 60 C66 100 63 140 64 180 L66 380 H120 L127 168 Q130 150 133 168 L140 380 H194 L196 180 C197 140 194 100 190 60" />
        {/* Fly */}
        <path d="M130 60 V122 Q130 134 140 136" strokeWidth="0.9" />
        {/* Front pockets */}
        <path d="M74 64 Q98 70 104 96" strokeWidth="0.9" />
        <path d="M186 64 Q162 70 156 96" strokeWidth="0.9" />
        {/* Coin pocket */}
        <path d="M166 66 L180 64 L181 80 L168 82 Z" strokeWidth="0.8" />
        {/* Hem stitching */}
        <path d="M66 372 H120 M140 372 H194" strokeWidth="0.7" strokeDasharray="2 2" />
      </g>

      {/* Measurement guides */}
      <g strokeWidth="0.9" fontFamily="inherit" fontSize="11" fill="currentColor">
        {/* Waist */}
        <line x1="70" y1="30" x2="190" y2="30" markerStart="url(#jeans-arrow)" markerEnd="url(#jeans-arrow)" />
        <text x="130" y="22" textAnchor="middle" stroke="none">Waist</text>

        {/* Hip */}
        <line x1="66" y1="120" x2="194" y2="120" markerStart="url(#jeans-arrow)" markerEnd="url(#jeans-arrow)" />
        <line x1="40" y1="120" x2="62" y2="120" strokeDasharray="2 2" />
        <text x="36" y="124" textAnchor="end" stroke="none">Hip</text>

        {compact ? null : (
          <>
            {/* Full length */}
            <line x1="222" y1="46" x2="222" y2="380" markerStart="url(#jeans-arrow)" markerEnd="url(#jeans-arrow)" />
            <text x="232" y="214" stroke="none" transform="rotate(90 232 214)" textAnchor="middle">Full Length</text>

            {/* Inseam */}
            <line x1="152" y1="178" x2="152" y2="378" markerStart="url(#jeans-arrow)" markerEnd="url(#jeans-arrow)" />
            <text x="162" y="280" stroke="none" transform="rotate(90 162 280)" textAnchor="middle">Inseam</text>

            {/* Bottom opening */}
            <line x1="66" y1="396" x2="120" y2="396" markerStart="url(#jeans-arrow)" markerEnd="url(#jeans-arrow)" />
            <text x="93" y="412" textAnchor="middle" stroke="none">Bottom Opening</text>
          </>
        )}
      </g>
    </svg>
  )
}
