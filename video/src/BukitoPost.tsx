import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { KenBurns } from "./components/KenBurns";

const COCONUT_SAND = "#F8F5EA";

export const BukitoPost: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = ["NIGHT", "COFFEE", "AND", "JUNGLE", "WALKS"];

  // Divider line draws in from left
  const dividerProgress = spring({
    fps,
    frame: frame - words.length * 8 - 10,
    config: { damping: 200 },
    durationInFrames: 30,
  });
  const dividerWidth = interpolate(dividerProgress, [0, 1], [0, 200]);

  // Bottom text fade in
  const bottomOpacity = spring({
    fps,
    frame: frame - words.length * 8 - 25,
    config: { damping: 200 },
    durationInFrames: 30,
  });

  return (
    <AbsoluteFill>
      {/* Background photo with Ken Burns */}
      <KenBurns
        src={staticFile("/photos/BUKITO_IG15.webp")}
        direction="in"
        intensity={0.1}
      />

      {/* Dark gradient overlay */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.15) 100%)",
        }}
      />

      {/* Content */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
        }}
      >
        {/* Word by word animated text */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 16,
            maxWidth: 800,
          }}
        >
          {words.map((word, i) => {
            const wordProgress = spring({
              fps,
              frame: frame - i * 8,
              config: { damping: 200 },
              durationInFrames: 25,
            });
            const y = interpolate(wordProgress, [0, 1], [50, 0]);

            return (
              <span
                key={i}
                style={{
                  fontFamily: "Kisrre, sans-serif",
                  fontSize: 72,
                  color: COCONUT_SAND,
                  letterSpacing: "-0.03em",
                  textTransform: "uppercase" as const,
                  display: "inline-block",
                  transform: `translateY(${y}px)`,
                  opacity: wordProgress,
                }}
              >
                {word}
              </span>
            );
          })}
        </div>

        {/* Divider line */}
        <div
          style={{
            width: dividerWidth,
            height: 2,
            backgroundColor: COCONUT_SAND,
            marginTop: 40,
            opacity: dividerProgress,
          }}
        />

        {/* Bottom text */}
        <div
          style={{
            marginTop: 40,
            opacity: interpolate(bottomOpacity, [0, 1], [0, 1]),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              fontFamily: "Kisrre, sans-serif",
              fontSize: 36,
              color: COCONUT_SAND,
              letterSpacing: "-0.02em",
              textTransform: "uppercase" as const,
            }}
          >
            BUKITO
          </div>
          <div
            style={{
              fontFamily: "Kisrre, sans-serif",
              fontSize: 18,
              color: "rgba(248,245,234,0.6)",
              letterSpacing: "0.15em",
              textTransform: "uppercase" as const,
            }}
          >
            @BUKITO.SUMBAWA
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
