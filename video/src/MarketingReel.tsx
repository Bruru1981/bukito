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
import "../src/fonts";

// === Reusable Components ===

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

const KenBurnsImg: React.FC<{
  src: string;
  direction?: "in" | "out";
  intensity?: number;
}> = ({ src, direction = "in", intensity = 0.12 }) => {
  const frame = useCurrentFrame();
  const scale =
    direction === "in"
      ? interpolate(frame, [0, 150], [1, 1 + intensity], {
          extrapolateRight: "clamp",
        })
      : interpolate(frame, [0, 150], [1 + intensity, 1], {
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

// === Scene Components ===

const IntroScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <KenBurnsImg
        src={staticFile("/photos/bukito-exterior.webp")}
        direction="in"
      />
      {/* Dark overlay */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)",
        }}
      />
      {/* Content */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          padding: "0 80px 160px",
          gap: "16px",
        }}
      >
        <SlideUp delay={15}>
          <div
            style={{
              fontFamily: "Kisrre, sans-serif",
              fontSize: "80px",
              color: "#F8F5EA",
              letterSpacing: "-0.05em",
              textTransform: "uppercase",
              lineHeight: 0.9,
            }}
          >
            BUKITO
          </div>
        </SlideUp>
        <SlideUp delay={25}>
          <div
            style={{
              fontFamily: "Kisrre, sans-serif",
              fontSize: "14px",
              color: "#E67E32",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            KERTASARI, SUMBAWA
          </div>
        </SlideUp>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const MenuScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#F8F5EA" }}>
      {/* Photo top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          width: "100%",
          height: "55%",
          overflow: "hidden",
        }}
      >
        <KenBurnsImg
          src={staticFile("/photos/BUKITO_IG3.webp")}
          direction="out"
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: "50%",
            background:
              "linear-gradient(to top, #F8F5EA 0%, rgba(248,245,234,0) 100%)",
          }}
        />
      </div>
      {/* Text content */}
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
              fontSize: "12px",
              color: "#E67E32",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            ON THE MENU
          </div>
        </FadeIn>
        <SlideUp delay={10}>
          <div
            style={{
              fontFamily: "Kisrre, sans-serif",
              fontSize: "64px",
              color: "#6D0000",
              letterSpacing: "-0.05em",
              textTransform: "uppercase",
              lineHeight: 0.9,
            }}
          >
            COCONUT
            <br />
            COLD BREW
          </div>
        </SlideUp>
        <FadeIn delay={25}>
          <div
            style={{
              fontFamily: "Kisrre, sans-serif",
              fontSize: "16px",
              color: "#6D0000",
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              opacity: 0.5,
              lineHeight: 1.5,
            }}
          >
            FRESH COCONUT WATER, HOUSE COLD BREW,
            <br />
            PALM SUGAR, CRUSHED ICE
          </div>
        </FadeIn>
        <SlideUp delay={35}>
          <div
            style={{
              fontFamily: "Kisrre, sans-serif",
              fontSize: "22px",
              color: "#008134",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginTop: "8px",
            }}
          >
            RP 35.000
          </div>
        </SlideUp>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const VibeScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <KenBurnsImg
        src={staticFile("/photos/BUKITO_IG1.webp")}
        direction="in"
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
          gap: "20px",
        }}
      >
        <FadeIn delay={5}>
          <div
            style={{
              fontFamily: "Kisrre, sans-serif",
              fontSize: "11px",
              color: "#E67E32",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            THE BUKITO WAY
          </div>
        </FadeIn>
        <SlideUp delay={12}>
          <div
            style={{
              fontFamily: "Kisrre, sans-serif",
              fontSize: "56px",
              color: "#F8F5EA",
              letterSpacing: "-0.05em",
              textTransform: "uppercase",
              lineHeight: 0.95,
            }}
          >
            NIGHT COFFEE
            <br />
            AND JUNGLE
            <br />
            WALKS
          </div>
        </SlideUp>
        <FadeIn delay={30}>
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
            WHERE THE OCEAN MEETS THE JUNGLE
          </div>
        </FadeIn>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.97, 1.03]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#6D0000",
        justifyContent: "center",
        alignItems: "center",
        gap: "32px",
      }}
    >
      <SlideUp delay={5}>
        <div
          style={{
            fontFamily: "Kisrre, sans-serif",
            fontSize: "16px",
            color: "#E67E32",
            letterSpacing: "0.2em",
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
            fontSize: "96px",
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
            fontSize: "13px",
            color: "#F8F5EA",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            opacity: 0.5,
          }}
        >
          @BUKITO.SUMBAWA
        </div>
      </FadeIn>
    </AbsoluteFill>
  );
};

// === Main Composition ===

export const MarketingReel: React.FC = () => {
  return (
    <AbsoluteFill>
      <Series>
        <Series.Sequence durationInFrames={75}>
          <IntroScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={90}>
          <MenuScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={90}>
          <VibeScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={75}>
          <OutroScene />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
