import { MorningGreeting } from "@/components/Hero/MorningGreeting";
import { LakeOfTheDay } from "@/components/GardenCity/LakeOfTheDay";
import { ParkSpotlight } from "@/components/GardenCity/ParkSpotlight";
import { BangaloreMap } from "@/components/GardenCity/BangaloreMap";
import { BirdOfTheDay } from "@/components/GardenCity/BirdOfTheDay";
import { WordOfTheDay } from "@/components/KannadaWord/WordOfTheDay";
import { StartupOfTheDay } from "@/components/BuiltHere/StartupOfTheDay";
import { GitHubTrending } from "@/components/BuiltHere/GitHubTrending";
import { HistoricalMoment } from "@/components/CityLife/HistoricalMoment";
import { DidYouKnow } from "@/components/CityLife/DidYouKnow";
import { PersonOfTheDay } from "@/components/FamousBangalorean/PersonOfTheDay";
import { WikiDeepDive } from "@/components/ThenAndNow/WikiDeepDive";
import { CounterGrid } from "@/components/CityNumbers/CounterGrid";
import { TrafficPulse } from "@/components/Traffic/TrafficPulse";
import { MetroCard } from "@/components/Traffic/MetroCard";
import { NostalgiaSection } from "@/components/Nostalgia/NostalgiaSection";
import { NewsSection } from "@/components/News/NewsSection";
import { EventsSection } from "@/components/Events/EventsSection";
import { DarshiniPick } from "@/components/Food/DarshiniPick";
import { SectionNav } from "@/components/Nav/SectionNav";
import { SectionTOC } from "@/components/Nav/SectionTOC";

/** Thin rule used between same-background sections */
function Rule() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="h-px" style={{ background: "rgba(198, 124, 42, 0.12)" }} />
    </div>
  );
}

/** Editorial section label: short line + small-caps text */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-6 h-px flex-shrink-0" style={{ background: "#C67C2A" }} />
      <span
        className="text-xs tracking-[0.25em] uppercase font-medium"
        style={{ color: "#C67C2A" }}
      >
        {children}
      </span>
    </div>
  );
}

/** Same label on dark backgrounds */
function LabelDark({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-6 h-px flex-shrink-0" style={{ background: "#D4A843" }} />
      <span
        className="text-xs tracking-[0.25em] uppercase font-medium"
        style={{ color: "#D4A843" }}
      >
        {children}
      </span>
    </div>
  );
}

export default function Home() {
  return (
    <main style={{ backgroundColor: "#F6F6F4" }}>

      {/* ── Nav ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(246, 246, 244, 0.92)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(198, 124, 42, 0.1)",
        }}
      >
        <div className="flex items-center gap-3">
          <span className="font-kannada font-bold text-lg" style={{ color: "#2D5016" }}>
            ನಮ್ಮ ಊರು
          </span>
          <span className="text-xs hidden sm:block" style={{ color: "#8B7355" }}>
            · Bengaluru
          </span>
        </div>
        <div className="font-lora italic text-sm hidden sm:block" style={{ color: "#C67C2A" }}>
          A love letter to ಬೆಂಗಳೂರು
        </div>
      </nav>

      <SectionNav />
      <SectionTOC />

      {/* ── 1. Hero ── */}
      <div id="hero">
        <MorningGreeting />
      </div>

      {/* ── 2. Traffic — what people open this for ── */}
      <section id="traffic" className="py-20 px-4" style={{ backgroundColor: "#1a1a2e" }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <LabelDark>Namma Traffic</LabelDark>
            <h2 className="font-lora text-4xl md:text-5xl" style={{ color: "#FFFFFF" }}>
              Beat the Rush
            </h2>
            <p className="mt-2 text-sm max-w-lg" style={{ color: "rgba(255,255,255,0.45)" }}>
              Corridor status, Namma Metro network, and Bangalore traffic wisdom
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrafficPulse />
            <MetroCard />
          </div>
        </div>
      </section>

      {/* ── 3. Bengaluru News ── */}
      <div id="news" style={{ backgroundColor: "#FFFFFF" }}><NewsSection /></div>

      {/* ── 4. Events ── */}
      <div id="events"><EventsSection /></div>

      {/* ── 5. Garden City ── */}
      <section id="nature" className="py-20 px-4" style={{ backgroundColor: "#E8F2EA" }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <Label>Garden City</Label>
            <h2 className="font-lora text-4xl md:text-5xl" style={{ color: "#2D5016" }}>
              The Green Heart of India
            </h2>
            <p className="mt-2 text-sm max-w-lg" style={{ color: "#8B7355" }}>
              Lakes, parks, forests: Bengaluru&apos;s extraordinary natural abundance
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <LakeOfTheDay />
            <ParkSpotlight />
          </div>
          <div className="mb-6">
            <BirdOfTheDay />
          </div>
          <BangaloreMap />
        </div>
      </section>

      {/* ── Darshini Pick ── */}
      <section className="py-16 px-4" style={{ backgroundColor: "#FFF4F0" }}>
        <div className="max-w-6xl mx-auto">
          <Label>Namma Tiffin</Label>
          <h2 className="font-lora text-3xl md:text-4xl mb-8" style={{ color: "#2D5016" }}>
            Darshini of the Day
          </h2>
          <DarshiniPick />
        </div>
      </section>

      {/* ── Kannada Word ── */}
      <div id="kannada" style={{ backgroundColor: "#EEF1F8" }}><WordOfTheDay /></div>

      {/* ── Built Here ── */}
      <section id="tech" className="py-20 px-4" style={{ backgroundColor: "#F0F2F0" }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <Label>Built in Bengaluru</Label>
            <h2 className="font-lora text-4xl md:text-5xl" style={{ color: "#2D5016" }}>
              Silicon Valley of the East
            </h2>
            <p className="mt-2 text-sm max-w-lg" style={{ color: "#8B7355" }}>
              The companies that changed how India and the world works
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StartupOfTheDay />
            <GitHubTrending />
          </div>
        </div>
      </section>

      {/* ── History & Famous People ── */}
      <section id="history" className="py-20 px-4" style={{ backgroundColor: "#EDEEF4" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <Label>City Memory</Label>
              <h2 className="font-lora text-3xl md:text-4xl mb-8" style={{ color: "#2D5016" }}>
                Bengaluru Then &amp; Now
              </h2>
              <HistoricalMoment />
            </div>
            <div>
              <Label>Famous Bangaloreans</Label>
              <h2 className="font-lora text-3xl md:text-4xl mb-8" style={{ color: "#2D5016" }}>
                Person of the Day
              </h2>
              <PersonOfTheDay />
            </div>
          </div>
        </div>
      </section>

      {/* ── Did You Know ── */}
      <section className="py-16 px-4" style={{ backgroundColor: "#F6F6F4" }}>
        <div className="max-w-6xl mx-auto">
          <Label>Bengaluru Trivia</Label>
          <DidYouKnow />
        </div>
      </section>

      {/* ── 8. Nostalgia — single daily photo, dark section ── */}
      <NostalgiaSection />

      {/* ── 9. Wiki Deep Dive ── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <Label>Deep Dive</Label>
          <h2 className="font-lora text-3xl md:text-4xl mb-8" style={{ color: "#2D5016" }}>
            Know Your City
          </h2>
          <WikiDeepDive />
        </div>
      </section>

      {/* ── City Numbers ── */}
      <div id="numbers"><CounterGrid /></div>

      {/* ── Footer ── */}
      <footer
        className="py-12 px-4 text-center"
        style={{ borderTop: "1px solid rgba(198, 124, 42, 0.1)" }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="font-kannada text-4xl font-bold mb-1" style={{ color: "#2D5016" }}>
            ನಮ್ಮ ಊರು
          </div>
          <div className="font-lora italic text-lg mb-4" style={{ color: "#C67C2A" }}>
            Namma Ooru
          </div>
          <p className="text-sm mb-6" style={{ color: "#8B7355" }}>
            Our city. Our stories. A quiet celebration of Bengaluru.
          </p>
          <div className="text-xs space-y-1.5" style={{ color: "rgba(92, 58, 30, 0.5)" }}>
            <p>
              Made with ಪ್ರೀತಿ (prīti) for Bengaluru by{" "}
              <a
                href="https://snanu.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 transition-opacity hover:opacity-70"
                style={{ color: "#C67C2A" }}
              >
                Sandeep Nanu
              </a>
              . Data from free &amp; open sources.
            </p>
            <p>
              For suggestions or edits, write to{" "}
              <a
                href="mailto:shiftingradius@gmail.com"
                className="underline underline-offset-2 transition-opacity hover:opacity-70"
                style={{ color: "#C67C2A" }}
              >
                shiftingradius@gmail.com
              </a>
            </p>
            <p className="pt-1">
              If you like this,{" "}
              <a
                href="https://razorpay.me/@sandeepnanu"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 transition-opacity hover:opacity-70"
                style={{ color: "#C67C2A" }}
              >
                buy me a beer
              </a>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
