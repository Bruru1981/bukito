import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const KenBurns: React.FC<{
  src: string;
  direction?: "in" | "out";
  intensity?: number;
}> = ({ src, direction = "in", intensity = 0.15 }) => {
  const frame = useCurrentFrame();
  const scale =
    direction === "in"
      ? interpolate(frame, [0, 120], [1, 1 + intensity], {
          extrapolateRight: "clamp",
        })
      : interpolate(frame, [0, 120], [1 + intensity, 1], {
          extrapolateRight: "clamp",
        });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
        }}
      />
    </AbsoluteFill>
  );
};
