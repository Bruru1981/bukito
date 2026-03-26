import { LandingSection } from "./sections/LandingSection";
import { IdentitySection } from "./sections/IdentitySection";
import { MosaicSection } from "./sections/MosaicSection";
import { MenuSection } from "./sections/MenuSection";
import { BlogSection } from "./sections/BlogSection";
import { PlaylistSection } from "./sections/PlaylistSection";
import { JourneySection } from "./sections/JourneySection";
import { FooterSection } from "./sections/FooterSection";

export default function Home() {
  return (
    <div className="relative">
      <h1 className="sr-only">
        Bukito — Restaurant and Coffee Bar in Kertasari, Sumbawa
      </h1>
      <div className="grain pointer-events-none" />

      <LandingSection />
      <IdentitySection />
      <MosaicSection />
      <MenuSection />
      <BlogSection />
      <PlaylistSection />
      <JourneySection />
      <FooterSection />
    </div>
  );
}
