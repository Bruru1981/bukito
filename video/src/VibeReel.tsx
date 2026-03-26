import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Series,
} from "remotion";
import "./fonts";

// === Components ===

const FadeIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}> = ({ children, delay = 0, duration = 20 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <div style={{ opacity }}>{children}</div>;
};

const SlideUp: React.FC<{
  children: React.ReactNode;
  delay?: number;
}> = ({ children, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    fps,
    frame: frame - delay,
    config: { damping: 200 },
    durationInFrames: 25,
  });
  const y = interpolate(progress, [0, 1], [80, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  return (
    <div style={{ transform: `translateY(${y}px)`, opacity }}>{children}</div>
  );
};

const KenBurns: React.FC<{
  src: string;
  direction?: "in" | "out";
  intensity?: number;
}> = ({ src, direction = "in", intensity = 0.15 }) => {
  const frame = useCurrentFrame();
  const scale =
    direction === "in"
      ? interpolate(frame, [0, 180], [1, 1 + intensity], {
          extrapolateRight: "clamp",
        })
      : interpolate(frame, [0, 180], [1 + intensity, 1], {
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

// === Scene 1: Ocean establishing ===
const OceanScene: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <KenBurns
      src={staticFile("/photos/BUKITO_IG22.webp")}
      direction="in"
      intensity={0.1}
    />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)",
      }}
    />
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "0 80px 200px",
      }}
    >
      <FadeIn delay={20} duration={30}>
        <div
          style={{
            fontFamily: "Kisrre, sans-serif",
            fontSize: "14px",
            color: "#E67E32",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          SOMEWHERE IN SUMBAWA
        </div>
      </FadeIn>
    </AbsoluteFill>
  </AbsoluteFill>
);

// === Scene 2: Jungle mood ===
const JungleScene: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <KenBurns
      src={staticFile("/photos/BUKITO_IG7.webp")}
      direction="out"
      intensity={0.12}
    />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)",
      }}
    />
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        padding: "0 80px 200px",
        gap: "16px",
      }}
    >
      <SlideUp delay={10}>
        <div
          style={{
            fontFamily: "Kisrre, sans-serif",
            fontSize: "60px",
            color: "#F8F5EA",
            letterSpacing: "-0.05em",
            textTransform: "uppercase",
            lineHeight: 0.9,
          }}
        >
          WHERE THE
          <br />
          OCEAN MEETS
          <br />
          THE JUNGLE
        </div>
      </SlideUp>
    </AbsoluteFill>
  </AbsoluteFill>
);

// === Scene 3: Night life ===
const NightScene: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <KenBurns
      src={staticFile("/photos/BUKITO_IG1.webp")}
      direction="in"
      intensity={0.08}
    />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.75) 100%)",
      }}
    />
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        padding: "0 80px 200px",
        gap: "12px",
      }}
    >
      <FadeIn delay={5}>
        <div
          style={{
            fontFamily: "Kisrre, sans-serif",
            fontSize: "11px",
            color: "#E67E32",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          AFTER DARK
        </div>
      </FadeIn>
      <SlideUp delay={12}>
        <div
          style={{
            fontFamily: "Kisrre, sans-serif",
            fontSize: "52px",
            color: "#F8F5EA",
            letterSpacing: "-0.05em",
            textTransform: "uppercase",
            lineHeight: 0.95,
          }}
        >
          MIDNIGHT
          <br />
          ESPRESSO AND
          <br />
          STARLIT SKIES
        </div>
      </SlideUp>
    </AbsoluteFill>
  </AbsoluteFill>
);

// === Scene 4: Village life ===
const VillageScene: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <KenBurns
      src={staticFile("/photos/BUKITO_IG15.webp")}
      direction="out"
      intensity={0.1}
    />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(0,0,0,0.65) 100%)",
      }}
    />
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        padding: "0 80px 200px",
        gap: "12px",
      }}
    >
      <SlideUp delay={10}>
        <div
          style={{
            fontFamily: "Kisrre, sans-serif",
            fontSize: "48px",
            color: "#F8F5EA",
            letterSpacing: "-0.05em",
            textTransform: "uppercase",
            lineHeight: 0.95,
          }}
        >
          SLOW MORNINGS
          <br />
          WILD NIGHTS
        </div>
      </SlideUp>
      <FadeIn delay={25}>
        <div
          style={{
            fontFamily: "Kisrre, sans-serif",
            fontSize: "14px",
            color: "#F8F5EA",
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            opacity: 0.5,
          }}
        >
          KERTASARI, SUMBAWA
        </div>
      </FadeIn>
    </AbsoluteFill>
  </AbsoluteFill>
);

// === Scene 5: Outro ===
const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.96, 1.04]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#6D0000",
        justifyContent: "center",
        alignItems: "center",
        gap: "28px",
      }}
    >
      <SlideUp delay={5}>
        <div
          style={{
            fontFamily: "Kisrre, sans-serif",
            fontSize: "14px",
            color: "#E67E32",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
          }}
        >
          PARADISE WITH FANGS
        </div>
      </SlideUp>
      <SlideUp delay={15}>
        <div
          style={{
            fontFamily: "Kisrre, sans-serif",
            fontSize: "88px",
            color: "#F8F5EA",
            letterSpacing: "-0.05em",
            textTransform: "uppercase",
            transform: `scale(${pulse})`,
          }}
        >
          BUKITO
        </div>
      </SlideUp>
      <FadeIn delay={30}>
        <div
          style={{
            fontFamily: "Kisrre, sans-serif",
            fontSize: "12px",
            color: "#F8F5EA",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            opacity: 0.4,
          }}
        >
          @BUKITO.SUMBAWA
        </div>
      </FadeIn>
    </AbsoluteFill>
  );
};

// === Main Composition ===
export const VibeReel: React.FC = () => (
  <AbsoluteFill>
    <Series>
      <Series.Sequence durationInFrames={75}>
        <OceanScene />
      </Series.Sequence>
      <Series.Sequence durationInFrames={90}>
        <JungleScene />
      </Series.Sequence>
      <Series.Sequence durationInFrames={90}>
        <NightScene />
      </Series.Sequence>
      <Series.Sequence durationInFrames={75}>
        <VillageScene />
      </Series.Sequence>
      <Series.Sequence durationInFrames={70}>
        <OutroScene />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);
