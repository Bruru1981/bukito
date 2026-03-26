import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const AnimatedText: React.FC<{
  text: string;
  delay?: number;
  fontSize?: number;
  color?: string;
  letterSpacing?: string;
}> = ({
  text,
  delay = 0,
  fontSize = 64,
  color = "#6D0000",
  letterSpacing = "-0.05em",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    fps,
    frame: frame - delay,
    config: { damping: 200 },
    durationInFrames: 30,
  });
  const y = interpolate(progress, [0, 1], [60, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        fontFamily: "Kisrre, sans-serif",
        fontSize,
        color,
        letterSpacing,
        textTransform: "uppercase" as const,
        transform: `translateY(${y}px)`,
        opacity,
      }}
    >
      {text}
    </div>
  );
};
