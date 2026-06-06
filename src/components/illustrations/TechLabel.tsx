export function TechLabel({
  x,
  y,
  text,
  anchor = 'middle',
}: {
  x: number
  y: number
  text: string
  anchor?: 'start' | 'middle' | 'end'
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fill="#9ca3af"
      fontSize="9"
      fontWeight="600"
      fontFamily="system-ui, sans-serif"
      letterSpacing="0.04em"
    >
      {text.toUpperCase()}
    </text>
  )
}
