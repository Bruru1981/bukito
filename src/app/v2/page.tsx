import { GateScene } from "./sections/GateScene";
import { ApproachScene } from "./sections/ApproachScene";
import { IdentityScene } from "./sections/IdentityScene";
import { TurnScene } from "./sections/TurnScene";
import { NightScene } from "./sections/NightScene";
import { GalleryScene } from "./sections/GalleryScene";
import { PathScene } from "./sections/PathScene";
import { SealScene } from "./sections/SealScene";
import { CursorFollower } from "./components/CursorFollower";
import { ScrollProgress } from "./components/ScrollProgress";

export default function V2Page() {
  return (
    <main id="main-content" className="relative">
      <h1 className="sr-only">
        Bukito — Restaurant And Coffee Bar In Kertasari, Sumbawa
      </h1>
      <div className="grain pointer-events-none" />
      <CursorFollower />
      <ScrollProgress />

      <div id="home"><GateScene /></div>
      <ApproachScene />
      <div id="about"><IdentityScene /></div>
      <div id="menu" />
      <TurnScene />
      <div id="journal"><NightScene /></div>
      <div id="gallery"><GalleryScene /></div>
      <div id="find-us"><PathScene /></div>
      <SealScene />
    </main>
  );
}
