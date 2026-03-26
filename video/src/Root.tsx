import "./index.css";
import "./fonts";
import { Composition } from "remotion";
import { BukitoReel } from "./BukitoReel";
import { BukitoPost } from "./BukitoPost";
import { MarketingReel } from "./MarketingReel";
import { VibeReel } from "./VibeReel";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BukitoReel"
        component={BukitoReel}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="BukitoPost"
        component={BukitoPost}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1080}
      />
      <Composition
        id="MarketingReel"
        component={MarketingReel}
        durationInFrames={330}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="VibeReel"
        component={VibeReel}
        durationInFrames={400}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
