import {
  AbsoluteFill,
  Img,
  Series,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { KenBurns } from "./components/KenBurns";
import { AnimatedText } from "./components/AnimatedText";

const SUNRUST = "#6D0000";
const COCONUT_SAND = "#F8F5EA";
const ORANGE_BEACH = "#E67E32";

const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = spring({
    fps,
    frame: frame - 30,
    config: { damping: 200 },
    durationInFrames: 30,
  });

  const locationOpacity = spring({
    fps,
    frame: frame - 50,
    config: { damping: 200 },
    durationInFrames: 30,
  });

  return (
    <AbsoluteFill>
      <KenBurns src={staticFile("/photos/BUKITO_IG1.webp")} direction="in" intensity={0.12} />

      {/* Dark gradient overlay from bottom */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 40%, transparent 70%)",
        }}
      />

      {/* Text at bottom */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 120,
        }}
      >
        <div style={{ opacity: titleOpacity }}>
          <AnimatedText text="BUKITO" fontSize={120} color="#FFFFFF" delay={30} />
        </div>
        <div
          style={{
            fontFamily: "Kisrre, sans-serif",
            fontSize: 24,
            color: "rgba(255,255,255,0.8)",
            letterSpacing: "0.3em",
            textTransform: "uppercase" as const,
            opacity: interpolate(locationOpacity, [0, 1], [0, 1]),
            marginTop: 16,
          }}
        >
          KERTASARI, SUMBAWA
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    fps,
    frame: frame - 15,
    config: { damping: 200 },
    durationInFrames: 30,
  });
  const titleY = interpolate(titleProgress, [0, 1], [80, 0]);

  const descOpacity = spring({
    fps,
    frame: frame - 35,
    config: { damping: 200 },
    durationInFrames: 30,
  });

  const priceProgress = spring({
    fps,
    frame: frame - 50,
    config: { damping: 200 },
    durationInFrames: 30,
  });
  const priceX = interpolate(priceProgress, [0, 1], [100, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: COCONUT_SAND }}>
      {/* Photo top 60% */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "60%", overflow: "hidden" }}>
        <KenBurns src={staticFile("/photos/BUKITO_IG7.webp")} direction="out" intensity={0.1} />
        {/* Gradient fade to background */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "40%",
            background: `linear-gradient(to top, ${COCONUT_SAND} 0%, transparent 100%)`,
          }}
        />
      </div>

      {/* Text content bottom */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 180,
        }}
      >
        <div
          style={{
            fontFamily: "Kisrre, sans-serif",
            fontSize: 72,
            color: SUNRUST,
            letterSpacing: "-0.03em",
            textTransform: "uppercase" as const,
            transform: `translateY(${titleY}px)`,
            opacity: titleProgress,
          }}
        >
          SMASH BURGER
        </div>

        <div
          style={{
            fontFamily: "Kisrre, sans-serif",
            fontSize: 22,
            color: SUNRUST,
            letterSpacing: "0.05em",
            textTransform: "uppercase" as const,
            opacity: interpolate(descOpacity, [0, 1], [0, 1]),
            marginTop: 16,
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          DOUBLE PATTY, CHEDDAR, CARAMELIZED ONIONS
        </div>

        <div
          style={{
            fontFamily: "Kisrre, sans-serif",
            fontSize: 48,
            color: ORANGE_BEACH,
            letterSpacing: "-0.02em",
            textTransform: "uppercase" as const,
            transform: `translateX(${priceX}px)`,
            opacity: priceProgress,
            marginTop: 32,
          }}
        >
          RP 85.000
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Staggered letter animation for tagline
  const tagline = "PARADISE WITH FANGS";
  const letters = tagline.split("");

  const logoOpacity = spring({
    fps,
    frame: frame - 20,
    config: { damping: 200 },
    durationInFrames: 30,
  });

  const handleOpacity = spring({
    fps,
    frame: frame - 35,
    config: { damping: 200 },
    durationInFrames: 30,
  });

  // Pulse animation on tagline
  const pulse = interpolate(
    Math.sin(frame * 0.15),
    [-1, 1],
    [0.97, 1.03],
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: SUNRUST,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Staggered tagline */}
      <div
        style={{
          display: "flex",
          fontFamily: "Kisrre, sans-serif",
          fontSize: 64,
          color: COCONUT_SAND,
          letterSpacing: "-0.02em",
          textTransform: "uppercase" as const,
          transform: `scale(${pulse})`,
        }}
      >
        {letters.map((letter, i) => {
          const letterProgress = spring({
            fps,
            frame: frame - i * 1.5,
            config: { damping: 200 },
            durationInFrames: 20,
          });
          const y = interpolate(letterProgress, [0, 1], [40, 0]);
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                transform: `translateY(${y}px)`,
                opacity: letterProgress,
                marginRight: letter === " " ? 16 : 0,
              }}
            >
              {letter === " " ? "\u00A0" : letter}
            </span>
          );
        })}
      </div>

      {/* Logo */}
      <Img
        src={staticFile("/logos/BUKITO_Wordmark.png")}
        style={{
          width: 400,
          objectFit: "contain",
          marginTop: 40,
          opacity: interpolate(logoOpacity, [0, 1], [0, 1]),
        }}
      />

      {/* Handle */}
      <div
        style={{
          fontFamily: "Kisrre, sans-serif",
          fontSize: 24,
          color: "rgba(248,245,234,0.7)",
          letterSpacing: "0.15em",
          textTransform: "uppercase" as const,
          position: "absolute",
          bottom: 100,
          opacity: interpolate(handleOpacity, [0, 1], [0, 1]),
        }}
      >
        @BUKITO.SUMBAWA
      </div>
    </AbsoluteFill>
  );
};

export const BukitoReel: React.FC = () => {
  return (
    <AbsoluteFill>
      <Series>
        <Series.Sequence durationInFrames={90}>
          <Scene1 />
        </Series.Sequence>
        <Series.Sequence durationInFrames={90}>
          <Scene2 />
        </Series.Sequence>
        <Series.Sequence durationInFrames={60}>
          <Scene3 />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
