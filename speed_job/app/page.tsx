"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { t: "Define the need", d: "Clarify scope, timeline, and success signals so the shortlist is accurate." },
  { t: "Screen & shortlist", d: "We filter candidates against requirements and communication readiness." },
  { t: "Coordinate interviews", d: "We schedule, prep candidates, and reduce back-and-forth." },
  { t: "Support onboarding", d: "We check in after placement and help smooth the transition." },
];

const faqs = [
  { q: "How fast can I receive a shortlist?", a: "Often within 72 hours, depending on role complexity and screening depth." },
  { q: "Do candidates pay to apply?", a: "No. Applying and being matched through SpeedJob is free for candidates." },
  { q: "Do you focus on remote roles only?", a: "Mostly remote, with select hybrid roles depending on location and role type." },
  { q: "What kind of roles do you support?", a: "Tech, operations, finance, project delivery, and other high-demand roles." },
];

const stories = [
  {
    name: "Olivia Daniels",
    role: "UX Designer • Atlanta",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    quote: "SpeedJob kept everything clear. I knew what to expect, and I felt prepared the whole time.",
  },
  {
    name: "James Morgan",
    role: "Financial Analyst • New York",
    image: "https://randomuser.me/api/portraits/men/43.jpg",
    quote: "No noise, no confusion. Just structured guidance and fast communication.",
  },
  {
    name: "Sofia Reyes",
    role: "Project Manager • Dallas",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    quote: "The match was accurate, and the support after placement was a pleasant surprise.",
  },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(!!mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

/** deterministic PRNG => fixes hydration mismatch */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededRange(rng: () => number, min: number, max: number) {
  return min + (max - min) * rng();
}

/** Split text into spans for GSAP stagger (keeps spaces) */
function SplitWords({
  text,
  className,
  wordClassName = "",
  as: Comp = "span",
  split = "words",
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  as?: any;
  split?: "words" | "chars";
}) {
  const parts = split === "chars" ? Array.from(text) : text.split(/(\s+)/); // preserve spaces

  return (
    <Comp className={className} aria-label={text}>
      {parts.map((p, i) => {
        const isSpace = /^\s+$/.test(p);
        if (isSpace) return <span key={i}>{p}</span>;
        return (
          <span
            key={i}
            className={cn("inline-block will-change-transform", wordClassName, split === "chars" ? "char" : "word")}
          >
            {p}
          </span>
        );
      })}
    </Comp>
  );
}

/** GSAP-friendly typewriter (no random/time in render) */
function TypewriterGSAP({
  phrases,
  className,
  cursorClassName,
}: {
  phrases: string[];
  className?: string;
  cursorClassName?: string;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const textRef = useRef<HTMLSpanElement | null>(null);
  const cursorRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!textRef.current) return;

    if (reducedMotion) {
      textRef.current.textContent = phrases[0] ?? "";
      return;
    }

    const el = textRef.current;
    const cursor = cursorRef.current;

    const cursorTween = cursor
      ? gsap.to(cursor, { opacity: 0.15, duration: 0.6, repeat: -1, yoyo: true, ease: "power1.inOut" })
      : null;

    let idx = 0;
    let stopped = false;

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const typeOne = async (phrase: string) => {
      // type
      for (let i = 0; i <= phrase.length; i++) {
        if (stopped) return;
        el.textContent = phrase.slice(0, i);
        await sleep(40);
      }
      await sleep(900);

      // delete
      for (let i = phrase.length; i >= 0; i--) {
        if (stopped) return;
        el.textContent = phrase.slice(0, i);
        await sleep(22);
      }
      await sleep(200);
    };

    (async () => {
      while (!stopped) {
        await typeOne(phrases[idx % phrases.length]);
        idx++;
      }
    })();

    return () => {
      stopped = true;
      cursorTween?.kill();
    };
  }, [phrases, reducedMotion]);

  return (
    <span className={cn("inline-flex items-baseline", className)}>
      <span ref={textRef} />
      <span ref={cursorRef} className={cn("ml-1 inline-block w-[1ch] text-emerald-300", cursorClassName)}>
        |
      </span>
    </span>
  );
}

export default function Page() {
  const nav = useMemo(
    () => [
      { id: "how", label: "How it works" },
      { id: "candidates", label: "Candidates" },
      { id: "stories", label: "Stories" },
      { id: "faq", label: "FAQ" },
    ],
    [],
  );

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const reducedMotion = usePrefersReducedMotion();

  // ✅ deterministic particles: stable SSR + client => no hydration mismatch
  const particles = useMemo(() => {
    const rng = mulberry32(1337); // change seed to change layout, still deterministic
    return Array.from({ length: 18 }).map((_, i) => {
      const size = seededRange(rng, 3, 7);
      const left = seededRange(rng, 6, 94);
      const top = seededRange(rng, 8, 88);
      const opacity = seededRange(rng, 0.15, 0.5);
      return { id: i, size, left, top, opacity };
    });
  }, []);

  // Refs for GSAP
  const heroRef = useRef<HTMLElement | null>(null);
  const heroBadgeRef = useRef<HTMLDivElement | null>(null);
  const heroH1Ref = useRef<HTMLHeadingElement | null>(null);
  const heroPRef = useRef<HTMLParagraphElement | null>(null);
  const heroCtasRef = useRef<HTMLDivElement | null>(null);
  const heroStatsRef = useRef<HTMLDivElement | null>(null);
  const scrollHintRef = useRef<HTMLDivElement | null>(null);
  const orb1Ref = useRef<HTMLDivElement | null>(null);
  const orb2Ref = useRef<HTMLDivElement | null>(null);
  const particleWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reducedMotion) return;
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      // HERO entrance
      gsap.set([heroBadgeRef.current, heroH1Ref.current, heroPRef.current, heroCtasRef.current, heroStatsRef.current], {
        autoAlpha: 0,
        y: 14,
      });

      // Word reveal inside hero paragraph
      const words = heroRef.current!.querySelectorAll(".hero-reveal .word");
      gsap.set(words, { autoAlpha: 0, y: 14, filter: "blur(6px)" });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(heroBadgeRef.current, { autoAlpha: 1, y: 0, duration: 0.55 }, 0.05)
        .to(heroH1Ref.current, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.12)
        .to(words, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.7, stagger: 0.015 }, 0.2)
        .to(heroCtasRef.current, { autoAlpha: 1, y: 0, duration: 0.55 }, 0.36)
        .to(heroStatsRef.current, { autoAlpha: 1, y: 0, duration: 0.55 }, 0.46)
        .to(scrollHintRef.current, { autoAlpha: 1, y: 0, duration: 0.65 }, 0.56);

      // Orbs float
      if (orb1Ref.current) {
        gsap.to(orb1Ref.current, { y: 18, duration: 6.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
        gsap.to(orb1Ref.current, { x: -12, duration: 9.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
      }
      if (orb2Ref.current) {
        gsap.to(orb2Ref.current, { y: -16, duration: 7.2, repeat: -1, yoyo: true, ease: "sine.inOut" });
        gsap.to(orb2Ref.current, { x: 10, duration: 10.2, repeat: -1, yoyo: true, ease: "sine.inOut" });
      }

      // Particles drift (animation only runs client-side)
      const ps = particleWrapRef.current?.querySelectorAll(".p");
      ps?.forEach((p) => {
        gsap.to(p, {
          y: gsap.utils.random(-26, 26),
          x: gsap.utils.random(-18, 18),
          duration: gsap.utils.random(4, 9),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: gsap.utils.random(0, 1.5),
        });
      });

      // Section reveals: any wrapper with data-reveal
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        const kids = el.querySelectorAll("[data-reveal-item]");
        gsap.set(kids, { autoAlpha: 0, y: 16, filter: "blur(8px)" });

        gsap.to(kids, {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.85,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 78%",
            toggleActions: "play none none none",
          },
        });
      });
    }, heroRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <main className="min-h-screen bg-[#070a12] text-white">
      {/* TOP BAR */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070a12]/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/10 font-semibold">
              SJ
            </span>
            <span className="text-base sm:text-lg font-semibold tracking-tight">SpeedJob</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {nav.map((x) => (
              <a
                key={x.id}
                href={`#${x.id}`}
                className="rounded-xl px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition"
              >
                {x.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center">
            <Link
              href="/apply"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-300 px-4 py-2 text-sm font-semibold text-[#070a12] hover:brightness-95 transition"
            >
              Apply <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* mobile section pills */}
        <div className="md:hidden border-t border-white/10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-2 min-w-max">
              {nav.map((x) => (
                <a
                  key={x.id}
                  href={`#${x.id}`}
                  className="rounded-full bg-white/5 px-3 py-1.5 text-xs ring-1 ring-white/10 text-white/75 hover:bg-white/10 hover:text-white transition"
                >
                  {x.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section ref={heroRef as any} className="relative min-h-[92vh] overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <Image src="/web.jpg" alt="Startup team collaboration" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#070a12] via-[#070a12]/80 to-[#070a12]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(16,185,129,0.12),transparent_60%),radial-gradient(circle_at_15%_25%,rgba(99,102,241,0.12),transparent_60%)]" />

          {/* Aura Orbs */}
          <div
            ref={orb1Ref}
            className="absolute -top-28 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-emerald-300/10 blur-3xl"
          />
          <div
            ref={orb2Ref}
            className="absolute -bottom-28 right-[-90px] h-[560px] w-[560px] rounded-full bg-indigo-400/10 blur-3xl"
          />

          {/* Grain */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3E%3Cpath fill='%23ffffff' fill-opacity='0.6' d='M1 0h1v1H1V0zm4 3h1v1H5V3zm7 5h1v1h-1V8zm8 2h1v1h-1V10zm4 6h1v1h-1v-1zM9 20h1v1H9v-1zm-6 6h1v1H3v-1zm18-5h1v1h-1v-1z'/%3E%3C/svg%3E\")",
            }}
          />

          {/* ✅ Particles (deterministic positions) */}
          <div ref={particleWrapRef} className="absolute inset-0">
            {particles.map((p) => (
              <span
                key={p.id}
                className="p absolute block rounded-full bg-white/10 ring-1 ring-white/10"
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  opacity: p.opacity,
                  filter: "blur(0.2px)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-16 sm:pt-20 pb-14">
          <div className="mx-auto max-w-2xl text-center">
            <div
              ref={heroBadgeRef}
              className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-white/75 ring-1 ring-white/10"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-300/80 animate-pulse" />
              Calm hiring. Fast matching. Real support.
            </div>

            <h1
              ref={heroH1Ref}
              className="mt-4 text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05]"
            >
              Quiet, curated hiring —{" "}
              <span className="text-white/70">
                <TypewriterGSAP
                  phrases={["without the chaos.", "with clarity.", "with calm onboarding.", "with real support."]}
                />
              </span>
            </h1>

            <p ref={heroPRef} className="mt-4 text-sm sm:text-base md:text-lg text-white/75 leading-relaxed">
              <SplitWords
                className="hero-reveal"
                text="SpeedJob delivers screened, remote-ready talent with a simple process: shortlists in motion, clean communication, and support through onboarding."
              />
            </p>

            <div ref={heroCtasRef} className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/apply"
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-emerald-300 px-6 py-3 font-semibold text-[#070a12] hover:brightness-95 transition"
              >
                Get started
                <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <a
                href="#how"
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-2xl bg-white/10 px-6 py-3 font-semibold ring-1 ring-white/10 hover:bg-white/15 transition"
              >
                See the process
              </a>
            </div>

            <div ref={heroStatsRef} className="mt-8 grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { k: "72h", v: "typical shortlist" },
                { k: "Screened", v: "real vetting" },
                { k: "Remote-ready", v: "calm onboarding" },
              ].map((x) => (
                <div key={x.k} className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-3 sm:p-4">
                  <div className="text-lg sm:text-xl font-semibold">{x.k}</div>
                  <div className="mt-1 text-[11px] sm:text-xs text-white/60">{x.v}</div>
                </div>
              ))}
            </div>

            {/* Scroll hint */}
            <div ref={scrollHintRef} className="mt-10 flex items-center justify-center opacity-0">
              <a
                href="#how"
                className="inline-flex items-center gap-2 text-xs text-white/55 hover:text-white/75 transition"
              >
                <span className="relative grid h-9 w-6 place-items-center rounded-full border border-white/15 bg-white/5">
                  <span className="absolute top-2 h-1.5 w-1.5 rounded-full bg-white/60 animate-bounce" />
                </span>
                Scroll to explore
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="mx-auto max-w-6xl px-4 sm:px-6 py-12 scroll-mt-24" data-reveal>
        <div className="max-w-2xl" data-reveal-item>
          <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight">How it works</h2>
          <p className="mt-3 text-white/70 leading-relaxed">A simple sequence that keeps hiring calm and predictable.</p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_420px]">
          <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 p-6 sm:p-8" data-reveal-item>
            <ol className="relative border-l border-white/10 pl-6 space-y-8">
              {steps.map((s, i) => (
                <li key={s.t} className="relative">
                  <span className="absolute -left-[38px] top-0 grid h-7 w-7 place-items-center rounded-full bg-emerald-300 text-[#070a12] text-xs font-semibold">
                    {i + 1}
                  </span>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="font-semibold">{s.t}</div>
                      <p className="mt-1 text-sm text-white/65 leading-relaxed">{s.d}</p>
                    </div>
                    <span className="hidden sm:inline-block rounded-full bg-white/5 px-3 py-1 text-xs text-white/60 ring-1 ring-white/10">
                      Outcome
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-3xl bg-[#0b1020]/60 ring-1 ring-white/10 p-6 sm:p-8" data-reveal-item>
            <p className="text-xs uppercase tracking-wider text-white/50">What you receive</p>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              {[
                "Curated shortlist based on role requirements",
                "Candidate readiness + communication screening",
                "Interview scheduling without back-and-forth",
                "Check-ins after placement",
              ].map((x) => (
                <li key={x} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-indigo-300/70 shrink-0" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
              <div className="text-sm font-semibold">Want a shortlist?</div>
              <div className="mt-1 text-xs text-white/60">Start in minutes. We’ll take it from there.</div>
              <Link
                href="/apply"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-[#070a12] hover:opacity-90 transition"
              >
                Apply <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CANDIDATES */}
      <section id="candidates" className="mx-auto max-w-6xl px-4 sm:px-6 py-12 scroll-mt-24" data-reveal>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
          <div data-reveal-item>
            <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight">
              For candidates <span className="text-white/70">— clarity and prep.</span>
            </h2>
            <p className="mt-3 text-white/70 leading-relaxed max-w-xl">
              A clean process that respects your time: relevant roles, real communication, and practical guidance.
            </p>
          </div>
          <div className="lg:justify-self-end" data-reveal-item>
            <Link
              href="/apply"
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-300 px-6 py-3 font-semibold text-[#070a12] hover:brightness-95 transition"
            >
              Apply as a candidate <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-7 rounded-3xl bg-white/5 ring-1 ring-white/10 p-6 sm:p-8" data-reveal-item>
            <div className="text-sm text-white/60">What this feels like</div>
            <div className="mt-2 text-xl sm:text-2xl font-semibold leading-snug">Quiet, structured, and honest.</div>
            <p className="mt-3 text-white/70 leading-relaxed">
              You’ll always know the next step — and you won’t be pushed into roles that don’t fit.
            </p>

            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              {["Roles aligned to your skills", "Interview prep + expectations", "Fast updates", "Support after placement"].map(
                (x) => (
                  <div key={x} className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 text-sm text-white/75">
                    {x}
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="lg:col-span-5 grid gap-4">
            <div className="rounded-3xl bg-[#0b1020]/60 ring-1 ring-white/10 p-6" data-reveal-item>
              <div className="text-xs uppercase tracking-wider text-white/50">Signal</div>
              <div className="mt-2 text-2xl font-semibold">Remote-ready</div>
              <p className="mt-2 text-sm text-white/65 leading-relaxed">
                Communication readiness + role fit checks before you’re matched.
              </p>
            </div>
            <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 p-6" data-reveal-item>
              <div className="text-xs uppercase tracking-wider text-white/50">Support</div>
              <div className="mt-2 text-2xl font-semibold">Real feedback</div>
              <p className="mt-2 text-sm text-white/65 leading-relaxed">
                Clear updates, not silence. Practical prep before interviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STORIES */}
      <section id="stories" className="mx-auto max-w-6xl px-4 sm:px-6 py-12 scroll-mt-24" data-reveal>
        <div className="max-w-2xl" data-reveal-item>
          <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight">
            Stories <span className="text-white/70">— support that feels human.</span>
          </h2>
          <p className="mt-3 text-white/70 leading-relaxed">
            A few calm, honest notes from people who moved faster with SpeedJob.
          </p>
        </div>

        <div className="mt-8 grid gap-4">
          {stories.map((t) => (
            <article key={t.name} className="rounded-3xl bg-white/5 ring-1 ring-white/10 p-6 sm:p-7" data-reveal-item>
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.image} alt={t.name} className="h-12 w-12 rounded-full object-cover" />
                <div className="min-w-0">
                  <div className="font-semibold truncate">{t.name}</div>
                  <div className="text-sm text-white/55 truncate">{t.role}</div>
                </div>
              </div>
              <p className="mt-4 text-white/80 leading-relaxed">
                <span className="text-white/60">“</span>
                {t.quote}
                <span className="text-white/60">”</span>
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-6xl px-4 sm:px-6 py-12 pb-16 scroll-mt-24" data-reveal>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="max-w-xl" data-reveal-item>
            <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight">FAQ</h2>
            <p className="mt-3 text-white/70 leading-relaxed">Short answers. Clear expectations.</p>

            <div className="mt-8 rounded-3xl bg-white ring-1 ring-black/10 p-6 sm:p-7 text-[#070a12]">
              <div className="text-lg font-semibold">Ready to move faster?</div>
              <p className="mt-2 text-[#070a12]/70">
                Apply as a candidate or share a role request for a curated shortlist.
              </p>
              <Link
                href="/apply"
                className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-emerald-300 px-5 py-2.5 font-semibold text-[#070a12] hover:brightness-95 transition"
              >
                Start with SpeedJob <ArrowRightIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="grid gap-3" data-reveal-item>
            {faqs.map((f, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={f.q} className="rounded-3xl bg-white/5 ring-1 ring-white/10">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left p-5 sm:p-6 hover:bg-white/7 transition rounded-3xl"
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="min-w-0">
                        <div className="font-semibold">{f.q}</div>
                        {isOpen && <p className="mt-2 text-sm text-white/70 leading-relaxed">{f.a}</p>}
                      </div>
                      <span className="mt-1 grid h-7 w-7 place-items-center rounded-full bg-white/10 ring-1 ring-white/10 text-white/80 shrink-0">
                        {isOpen ? "–" : "+"}
                      </span>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <footer className="mt-12 border-t border-white/10 pt-8 text-white/50 text-sm" data-reveal-item>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p>© SpeedJob. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-white transition">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white transition">
                Terms
              </Link>
            </div>
          </div>
        </footer>
      </section>
    </main>
  );
}
