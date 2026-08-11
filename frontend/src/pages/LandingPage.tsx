import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { centerApi } from '../api/centerApi';
import type { CollectionCenter } from '../types';
import CenterCard from '../components/center/CenterCard';
import LightTunnel from '../components/common/LightTunnel';

// ─── Count-Up Hook ───────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1800) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            setValue(Math.round(ease * target));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { value, ref };
}

// ─── Reveal Hook ─────────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({
  num,
  suffix,
  label,
  delay,
}: {
  num: number;
  suffix: string;
  label: string;
  delay: string;
}) {
  const { value, ref } = useCountUp(num);

  return (
    <div ref={ref} className="reveal" style={{ transitionDelay: delay }}>
      <div
        style={{
          padding: '2rem 2.5rem',
          borderRadius: '16px',
          background: 'rgba(13,22,17,0.6)',
          border: '1px solid rgba(74,222,128,0.12)',
          backdropFilter: 'blur(20px)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(3rem, 5vw, 4.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 1,
            background: 'linear-gradient(135deg, #4ade80, #86efac)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {value}
          {suffix}
        </div>
        <div
          style={{
            marginTop: '0.5rem',
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.875rem',
            color: 'rgba(237,247,238,0.55)',
            letterSpacing: '0.02em',
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

// ─── Material Cards Data ─────────────────────────────────────────────────────
const materialCards = [
  {
    id: '01',
    title: 'E-Waste & Computing',
    desc: 'Smartphones, Laptops, Monitors',
    gradient: 'linear-gradient(135deg, #1a2518 0%, #0d1a0f 100%)',
    accent: '#4ade80',
    accentBg: 'rgba(74,222,128,0.08)',
    glyph: '⬡',
    href: '/waste-guide/e-waste',
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop&auto=format',
    tag: 'High Priority',
  },
  {
    id: '02',
    title: 'Batteries & Energy',
    desc: 'Lithium-Ion, AA/AAA, Power Banks',
    gradient: 'linear-gradient(135deg, #1a1f10 0%, #141a0a 100%)',
    accent: '#a3e635',
    accentBg: 'rgba(163,230,53,0.08)',
    glyph: '⬡',
    href: '/waste-guide/battery',
    img: 'https://images.unsplash.com/photo-1609825488888-3a766db05542?w=600&h=400&fit=crop&auto=format',
    tag: 'Hazardous',
  },
  {
    id: '03',
    title: 'Plastics & Polymers',
    desc: 'PET Bottles, HDPE Packaging',
    gradient: 'linear-gradient(135deg, #0d1a16 0%, #091510 100%)',
    accent: '#34d399',
    accentBg: 'rgba(52,211,153,0.08)',
    glyph: '⬡',
    href: '/waste-guide/plastic',
    img: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=600&h=400&fit=crop&auto=format',
    tag: 'Common',
  },
  {
    id: '04',
    title: 'Appliances & Heavy',
    desc: 'Microwaves, AC Units, Audio',
    gradient: 'linear-gradient(135deg, #111d14 0%, #0c1610 100%)',
    accent: '#6ee7b7',
    accentBg: 'rgba(110,231,183,0.08)',
    glyph: '⬡',
    href: '/waste-guide/electronics',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format',
    tag: 'Bulky',
  },
  {
    id: '05',
    title: 'Glass & Paper Metals',
    desc: 'Cardboard, Aluminum, Glass Jars',
    gradient: 'linear-gradient(135deg, #0f1c11 0%, #0a1509 100%)',
    accent: '#86efac',
    accentBg: 'rgba(134,239,172,0.08)',
    glyph: '⬡',
    href: '/waste-guide/other',
    img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format',
    tag: 'Recyclable',
  },
];

function MaterialCard({
  card,
  index,
  active,
}: {
  card: (typeof materialCards)[0];
  index: number;
  active: number;
}) {
  const [hover, setHover] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    setTilt({ x, y });
  };

  const dist = index - active;
  const isActive = index === active;
  const isPast = index < active;

  const scale = isActive ? 1 : isPast ? 0.94 - (active - index) * 0.015 : 0.97;
  const yOffset = isActive ? 0 : isPast ? (active - index) * -8 : index * 12;
  const opacity = isPast ? Math.max(0.3, 1 - (active - index) * 0.2) : 1;
  const zIndex = materialCards.length - Math.abs(dist);
  const blurAmount = isPast ? (active - index) * 1 : 0;

  return (
    <div
      ref={cardRef}
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '20px',
        overflow: 'hidden',
        cursor: 'pointer',
        transform: `
          scale(${scale})
          translateY(${yOffset}px)
          ${hover && isActive ? `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)` : ''}
        `,
        opacity,
        zIndex,
        filter: blurAmount > 0 ? `blur(${blurAmount}px)` : 'none',
        transition:
          'transform 0.7s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.7s ease, filter 0.7s ease',
        transformStyle: 'preserve-3d',
        boxShadow: isActive
          ? `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px ${card.accent}30`
          : '0 8px 32px rgba(0,0,0,0.4)',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setTilt({ x: 0, y: 0 });
      }}
      onMouseMove={handleMouseMove}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: card.gradient,
          zIndex: 0,
        }}
      />
      {/* Image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        <img
          src={card.img}
          alt={card.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.18,
            transform: hover ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
          }}
        />
      </div>
      {/* Gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(to top, ${card.gradient.match(/#\w+/)?.[0] ?? '#000'} 0%, transparent 60%)`,
          zIndex: 2,
        }}
      />
      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          padding: '2.5rem',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Top row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.7rem',
              color: card.accent,
              letterSpacing: '0.15em',
              opacity: 0.8,
            }}
          >
            {card.id}
          </div>
          <span
            style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
              fontSize: '0.7rem',
              fontFamily: "'DM Mono', monospace",
              letterSpacing: '0.08em',
              color: card.accent,
              background: card.accentBg,
              border: `1px solid ${card.accent}30`,
            }}
          >
            {card.tag}
          </span>
        </div>

        {/* Bottom content */}
        <div>
          <div
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 700,
              color: '#edf7ee',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              marginBottom: '0.5rem',
            }}
          >
            {card.title}
          </div>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.9rem',
              color: 'rgba(237,247,238,0.55)',
              marginBottom: '1.5rem',
            }}
          >
            {card.desc}
          </div>
          <Link
            to={card.href}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: "'Outfit', sans-serif",
              fontSize: '0.85rem',
              fontWeight: 600,
              color: card.accent,
              textDecoration: 'none',
              borderBottom: `1px solid ${card.accent}40`,
              paddingBottom: '2px',
              transition: 'gap 0.25s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.gap = '0.75rem';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.gap = '0.5rem';
            }}
          >
            View Disposal Guidelines{' '}
            <span style={{ fontSize: '1rem' }}>→</span>
          </Link>
        </div>
      </div>

      {/* Hover glow */}
      {hover && isActive && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at ${50 + tilt.x * 4}% ${50 - tilt.y * 4}%, ${card.accent}10 0%, transparent 60%)`,
            zIndex: 4,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: 'What can I recycle through EcoDrop?',
    a: 'EcoDrop covers five major categories: e-waste and computing devices, batteries and energy storage, plastics and polymers, heavy appliances, and glass, paper, and metals. Each category has specific disposal guidelines.',
  },
  {
    q: 'How do I find a nearby drop-off center?',
    a: 'Use the Find Centers feature to search verified collection hubs by location, material type, distance, and available services. Results show ratings, accepted materials, and operating hours.',
  },
  {
    q: 'How are centers verified?',
    a: 'Centers listed on EcoDrop are reviewed and verified for legitimacy, compliance with waste handling practices, and community ratings. We prioritize centers aligned with responsible disposal standards.',
  },
  {
    q: 'Can I recycle batteries and electronics?',
    a: 'Yes. Batteries and electronics are among our priority categories due to their environmental impact. EcoDrop provides specific guidelines and locates specialized centers equipped to handle these safely.',
  },
  {
    q: 'What should I do before dropping off e-waste?',
    a: "Before drop-off: back up and wipe personal data from devices, remove batteries where possible, keep original packaging if available, and check the center's accepted materials list. Our waste guide provides detailed prep steps for each category.",
  },
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  const revealRef = useReveal();

  return (
    <section
      style={{
        padding: '120px 24px',
        maxWidth: 800,
        margin: '0 auto',
      }}
    >
      <div ref={revealRef} className="reveal" style={{ marginBottom: '4rem', textAlign: 'center' }}>
        <div className="eyebrow" style={{ marginBottom: '1.5rem' }}>
          Questions
        </div>
        <h2
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#edf7ee',
          }}
        >
          Questions,{' '}
          <span className="gradient-text">Answered.</span>
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="reveal"
            style={{ transitionDelay: `${i * 0.06}s` }}
          >
            <div
              style={{
                borderBottom: '1px solid rgba(74,222,128,0.1)',
                overflow: 'hidden',
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1.5rem 0',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  gap: '1rem',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    color: open === i ? '#4ade80' : '#edf7ee',
                    letterSpacing: '-0.01em',
                    transition: 'color 0.25s ease',
                    lineHeight: 1.3,
                  }}
                >
                  {faq.q}
                </span>
                <span
                  style={{
                    flexShrink: 0,
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: `1px solid ${open === i ? 'rgba(74,222,128,0.5)' : 'rgba(237,247,238,0.15)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: open === i ? '#4ade80' : 'rgba(237,247,238,0.5)',
                    fontSize: '1.1rem',
                    transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  +
                </span>
              </button>
              <div
                style={{
                  maxHeight: open === i ? '300px' : 0,
                  overflow: 'hidden',
                  transition: 'max-height 0.5s cubic-bezier(0.23,1,0.32,1)',
                }}
              >
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.925rem',
                    lineHeight: 1.7,
                    color: 'rgba(237,247,238,0.6)',
                    paddingBottom: '1.5rem',
                  }}
                >
                  {faq.a}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Hero HUD ─────────────────────────────────────────────────────────────────
function HeroHUD() {
  const { value: hubs, ref: hubsRef } = useCountUp(86);
  const { value: rating, ref: ratingRef } = useCountUp(49);

  return (
    <div
      style={{
        display: 'inline-flex',
        gap: '1px',
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'rgba(13,22,17,0.5)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(74,222,128,0.14)',
        boxShadow: '0 0 40px rgba(74,222,128,0.06)',
      }}
    >
      {[
        {
          ref: hubsRef,
          value: `${hubs}`,
          label: 'Verified Hubs',
          color: '#4ade80',
        },
        {
          ref: ratingRef,
          value: `${(rating / 10).toFixed(1)}★`,
          label: 'Community Rating',
          color: '#86efac',
        },
        {
          ref: null,
          value: 'CPCB',
          label: 'Compliance Focused',
          color: '#34d399',
        },
      ].map(({ ref, value, label, color }, i) => (
        <div
          key={i}
          ref={ref ?? undefined}
          style={{
            padding: '1rem 1.5rem',
            background: i === 1 ? 'rgba(74,222,128,0.04)' : 'transparent',
          }}
        >
          <div
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1.3rem',
              fontWeight: 800,
              color,
              letterSpacing: '-0.03em',
              lineHeight: 1,
            }}
          >
            {value}
          </div>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.7rem',
              color: 'rgba(237,247,238,0.45)',
              marginTop: '0.2rem',
              letterSpacing: '0.02em',
            }}
          >
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Timeline / How It Works ─────────────────────────────────────────────────
const steps = [
  {
    num: '01',
    title: 'Select',
    sub: 'Choose Your Material',
    desc: "Identify the category of waste you're looking to dispose of responsibly.",
    icon: '◈',
  },
  {
    num: '02',
    title: 'Locate',
    sub: 'Find Nearby Centers',
    desc: 'Discover verified drop-off locations within your area that accept your material.',
    icon: '◎',
  },
  {
    num: '03',
    title: 'Compare',
    sub: 'Compare Your Options',
    desc: 'Check distance, accepted materials, community ratings and available services.',
    icon: '⊞',
  },
  {
    num: '04',
    title: 'Drop-off',
    sub: 'Dispose Responsibly',
    desc: 'Take your waste to the right center and complete the circular journey.',
    icon: '◉',
  },
];

function HowItWorks() {
  const [active, setActive] = useState(0);
  const revealRef = useReveal();

  return (
    <section
      id="how-it-works"
      style={{
        padding: '120px 24px',
        background: 'linear-gradient(180deg, #06090a 0%, #0a1110 50%, #06090a 100%)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div
          ref={revealRef}
          className="reveal"
          style={{ textAlign: 'center', marginBottom: '80px' }}
        >
          <div className="eyebrow" style={{ marginBottom: '1.5rem' }}>
            Process
          </div>
          <h2
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#edf7ee',
              marginBottom: '1rem',
            }}
          >
            From Waste to{' '}
            <span className="gradient-text">Impact.</span>
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '1.05rem',
              color: 'rgba(237,247,238,0.5)',
              maxWidth: 500,
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Four simple steps to make responsible disposal effortless.
          </p>
        </div>

        {/* Desktop: horizontal timeline */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            position: 'relative',
          }}
        >
          {steps.map((step, i) => (
            <div
              key={i}
              className="reveal"
              style={{ transitionDelay: `${i * 0.1}s` }}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(0)}
            >
              <div
                style={{
                  padding: '2rem 1.5rem',
                  borderRadius: '16px',
                  background:
                    active === i
                      ? 'rgba(74,222,128,0.07)'
                      : 'rgba(13,22,17,0.4)',
                  border: `1px solid ${active === i ? 'rgba(74,222,128,0.25)' : 'rgba(74,222,128,0.08)'}`,
                  cursor: 'default',
                  transition: 'all 0.35s ease',
                  textAlign: 'center',
                }}
              >
                {/* Step icon circle */}
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    margin: '0 auto 1.5rem',
                    background:
                      active === i
                        ? 'linear-gradient(135deg, rgba(74,222,128,0.25), rgba(74,222,128,0.1))'
                        : 'rgba(74,222,128,0.06)',
                    border: `1px solid ${active === i ? 'rgba(74,222,128,0.4)' : 'rgba(74,222,128,0.15)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    color: '#4ade80',
                    transition: 'all 0.35s ease',
                    transform: active === i ? 'scale(1.1)' : 'scale(1)',
                    boxShadow: active === i ? '0 0 24px rgba(74,222,128,0.2)' : 'none',
                  }}
                >
                  {step.icon}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '0.65rem',
                    color: '#4ade80',
                    letterSpacing: '0.15em',
                    marginBottom: '0.5rem',
                    opacity: 0.7,
                  }}
                >
                  {step.num}
                </div>
                <div
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    color: '#edf7ee',
                    letterSpacing: '-0.02em',
                    marginBottom: '0.25rem',
                  }}
                >
                  {step.title}
                </div>
                <div
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    color: '#4ade80',
                    marginBottom: '0.75rem',
                    opacity: 0.8,
                  }}
                >
                  {step.sub}
                </div>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.85rem',
                    color: 'rgba(237,247,238,0.5)',
                    lineHeight: 1.6,
                    transition: 'color 0.3s ease',
                  }}
                >
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Trust Section ────────────────────────────────────────────────────────────
const trustItems = [
  {
    icon: '⊛',
    title: 'CPCB Alignment',
    desc: 'Platform designed with CPCB compliance guidelines and responsible disposal practices in mind.',
  },
  {
    icon: '◎',
    title: 'Verified Collection Hubs',
    desc: 'Every listed center is reviewed for legitimacy and responsible waste handling capability.',
  },
  {
    icon: '★',
    title: 'Community Ratings',
    desc: 'Real user reviews and ratings help you choose the best-quality drop-off center near you.',
  },
  {
    icon: '◉',
    title: 'Responsible Disposal',
    desc: 'Category-specific guidelines ensure your waste reaches the right destination safely.',
  },
];

function TrustSection() {
  const revealRef = useReveal();

  return (
    <section
      style={{
        padding: '120px 24px',
        background: '#06090a',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div
          ref={revealRef}
          className="reveal"
          style={{ textAlign: 'center', marginBottom: '72px' }}
        >
          <div className="eyebrow" style={{ marginBottom: '1.5rem' }}>
            Trust
          </div>
          <h2
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#edf7ee',
              marginBottom: '1rem',
            }}
          >
            Recycle With{' '}
            <span className="gradient-text">Confidence.</span>
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '1.05rem',
              color: 'rgba(237,247,238,0.5)',
              maxWidth: 560,
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            EcoDrop helps connect users with verified recycling infrastructure
            while promoting responsible disposal practices.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
          }}
        >
          {trustItems.map((item, i) => (
            <div
              key={i}
              className="reveal tilt-card"
              style={{ transitionDelay: `${i * 0.1}s` }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(-6px)';
                el.style.boxShadow = '0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(74,222,128,0.2)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  padding: '2rem',
                  borderRadius: '16px',
                  background: 'rgba(13,22,17,0.6)',
                  border: '1px solid rgba(74,222,128,0.1)',
                  height: '100%',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'rgba(74,222,128,0.08)',
                    border: '1px solid rgba(74,222,128,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    color: '#4ade80',
                    marginBottom: '1.25rem',
                  }}
                >
                  {item.icon}
                </div>
                <div
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#edf7ee',
                    letterSpacing: '-0.02em',
                    marginBottom: '0.5rem',
                  }}
                >
                  {item.title}
                </div>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.875rem',
                    color: 'rgba(237,247,238,0.5)',
                    lineHeight: 1.65,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Map CTA Section ──────────────────────────────────────────────────────────
function MapCTA() {
  const revealRef = useReveal();
  const dots = Array.from({ length: 24 }, (_, i) => ({
    cx: 20 + (i % 8) * 80 + Math.random() * 40,
    cy: 40 + Math.floor(i / 8) * 60 + Math.random() * 20,
    delay: Math.random() * 3,
    dur: 2 + Math.random() * 2,
  }));

  return (
    <section
      style={{
        padding: '120px 24px',
        background: 'linear-gradient(180deg, #06090a 0%, #071009 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated SVG map grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.6,
          pointerEvents: 'none',
        }}
      >
        <svg
          width="100%"
          height="100%"
          style={{ position: 'absolute', inset: 0 }}
        >
          <defs>
            <pattern id="grid" width="80" height="60" patternUnits="userSpaceOnUse">
              <path
                d="M 80 0 L 0 0 0 60"
                fill="none"
                stroke="rgba(74,222,128,0.05)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {dots.map((d, i) => (
            <g key={i}>
              <circle
                cx={d.cx + '%'}
                cy={d.cy + '%'}
                r="3"
                fill="#4ade80"
                opacity="0.6"
              >
                <animate
                  attributeName="opacity"
                  values="0.3;0.9;0.3"
                  dur={`${d.dur}s`}
                  begin={`${d.delay}s`}
                  repeatCount="indefinite"
                />
              </circle>
              <circle
                cx={d.cx + '%'}
                cy={d.cy + '%'}
                r="8"
                fill="none"
                stroke="#4ade80"
                strokeWidth="0.5"
                opacity="0"
              >
                <animate
                  attributeName="r"
                  values="4;20;4"
                  dur={`${d.dur}s`}
                  begin={`${d.delay}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.5;0;0.5"
                  dur={`${d.dur}s`}
                  begin={`${d.delay}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          ))}
        </svg>
      </div>

      <div
        ref={revealRef}
        className="reveal"
        style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}
      >
        <div className="eyebrow" style={{ marginBottom: '1.5rem' }}>
          Locate
        </div>
        <h2
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#edf7ee',
            marginBottom: '1.25rem',
            lineHeight: 1.1,
          }}
        >
          Your Next Drop-off Is{' '}
          <span className="gradient-text">Closer Than You Think.</span>
        </h2>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '1.05rem',
            color: 'rgba(237,247,238,0.5)',
            marginBottom: '2.5rem',
            lineHeight: 1.6,
          }}
        >
          Discover verified collection centers near you and find the right
          destination for your waste.
        </p>
        <Link to="/explore" className="btn-cta-primary">
          Find Nearby Centers <span className="arrow">→</span>
        </Link>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────
function FinalCTA() {
  const revealRef = useReveal();
  const particles = Array.from({ length: 20 }, (_, i) => ({
    left: `${5 + i * 5}%`,
    delay: `${(i * 0.3) % 4}s`,
    dur: `${4 + (i % 3)}s`,
    size: 2 + (i % 3),
  }));

  return (
    <section
      style={{
        padding: '140px 24px',
        background: 'linear-gradient(180deg, #06090a 0%, #071209 60%, #06090a 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="particle"
          style={{
            position: 'absolute',
            bottom: '10%',
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '50%',
            background: '#4ade80',
            animationDuration: p.dur,
            animationDelay: p.delay,
          }}
        />
      ))}

      {/* Glow */}
      <div
        style={{
          position: 'absolute',
          bottom: '-100px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '400px',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse, rgba(74,222,128,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        ref={revealRef}
        className="reveal"
        style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}
      >
        <h2
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(2.8rem, 5.5vw, 5rem)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            color: '#edf7ee',
            marginBottom: '1.25rem',
          }}
        >
          Don't Let Useful Materials{' '}
          <span className="gradient-text">Become Waste.</span>
        </h2>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '1.1rem',
            color: 'rgba(237,247,238,0.5)',
            marginBottom: '2.5rem',
            lineHeight: 1.6,
          }}
        >
          Find the right place for your next piece of waste.
        </p>
        <Link to="/explore" className="btn-cta-primary" style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}>
          Find a Drop-off Center <span className="arrow">→</span>
        </Link>
      </div>
    </section>
  );
}

// ─── Main Landing Page Component ─────────────────────────────────────────────
export default function LandingPage() {
  const [popularCenters, setPopularCenters] = useState<CollectionCenter[]>([]);
  const [cursorPos, setCursorPos] = useState({ x: -400, y: -400 });
  const [activeCard, setActiveCard] = useState(0);

  const stackRef = useRef<HTMLDivElement>(null);
  const heroReveal = useReveal();

  useEffect(() => {
    centerApi.getPopularCenters().then(setPopularCenters).catch(() => {});
  }, []);

  // Cursor + Scroll listeners
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    const handleScroll = () => {
      if (stackRef.current) {
        const rect = stackRef.current.getBoundingClientRect();
        const progress = Math.max(
          0,
          Math.min(1, -rect.top / (rect.height - window.innerHeight))
        );
        const idx = Math.min(
          materialCards.length - 1,
          Math.floor(progress * materialCards.length)
        );
        setActiveCard(idx);
      }
    };

    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Reveal observer
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ background: '#06090a', minHeight: '100vh', color: '#edf7ee' }}>
      {/* Cursor glow */}
      <div
        className="cursor-glow"
        style={{
          left: cursorPos.x,
          top: cursorPos.y,
        }}
      />

      {/* ── Hero Section ─────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          background:
            'linear-gradient(180deg, #040b06 0%, #071009 60%, #06090a 100%)',
        }}
      >
        {/* WebGL LightTunnel background */}
        <LightTunnel
          cableColor="#22c55e"
          pulseColor="#4ade80"
          tunnelColor="#10b981"
          tunnelOpacity={0}
          speed={0.15}
          flowDirection="outward"
          pulseSpeed={2.5}
          pulseLength={0.32}
          pulseBlend={1}
          pulseWidth={1}
          cableCount={24}
          thickness={0.4}
          rimWidth={0.2}
          waviness={0.35}
          sway={0.5}
          size={1.2}
          centerX={0}
          centerY={0}
          glow={1.5}
          fadeNear={0.4}
          fadeFar={2.2}
          brightness={1.2}
          colorVariance={true}
          grain={true}
          grainIntensity={0.04}
          opacity={1}
          mouseInteraction={true}
          mouseStrength={0.15}
        />

        {/* Static radial glow behind content */}
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '20%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(74,222,128,0.05) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Bottom gradient fade */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '200px',
            background: 'linear-gradient(to top, #06090a, transparent)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        {/* Hero content */}
        <div
          style={{
            position: 'relative',
            zIndex: 3,
            width: '100%',
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '140px 24px 80px',
          }}
        >
          <div ref={heroReveal} style={{ maxWidth: '780px' }}>
            {/* Eyebrow */}
            <div className="reveal" style={{ marginBottom: '2rem' }}>
              <span className="eyebrow">
                <span>♻</span>
                VERIFIED RECYCLING NETWORK
              </span>
            </div>

            {/* Headline */}
            <h1
              className="reveal reveal-delay-1"
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 'clamp(3.5rem, 7vw, 7rem)',
                fontWeight: 900,
                letterSpacing: '-0.04em',
                lineHeight: 1.0,
                color: '#edf7ee',
                marginBottom: '1.5rem',
              }}
            >
              Give Your Waste A{' '}
              <span
                style={{
                  background:
                    'linear-gradient(135deg, #4ade80 0%, #86efac 40%, #22d3ee 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Better Destination.
              </span>
            </h1>

            {/* Supporting text */}
            <p
              className="reveal reveal-delay-2"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
                color: 'rgba(237,247,238,0.55)',
                lineHeight: 1.65,
                maxWidth: '560px',
                marginBottom: '2.5rem',
              }}
            >
              Find verified drop-off centers, discover specialized disposal
              guidelines, and make every piece of waste part of a smarter
              circular future.
            </p>

            {/* CTAs */}
            <div
              className="reveal reveal-delay-3"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '3.5rem',
                alignItems: 'center',
              }}
            >
              <Link to="/explore" className="btn-cta-primary magnetic">
                Find Drop-off Centers <span className="arrow">→</span>
              </Link>
              <Link to="/waste-guide" className="btn-cta-secondary magnetic">
                Explore Waste Guide
              </Link>
            </div>

            {/* HUD */}
            <div className="reveal reveal-delay-4">
              <HeroHUD />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.4rem',
            opacity: 0.3,
          }}
        >
          <div
            style={{
              width: '1px',
              height: '40px',
              background: 'linear-gradient(180deg, transparent, #4ade80)',
            }}
          />
        </div>
      </section>

      {/* ── Recycle Today / Materials Section ──────────────────────── */}
      <section
        ref={stackRef}
        style={{
          position: 'relative',
          height: `${materialCards.length * 80 + 100}vh`,
        }}
      >
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            background: '#06090a',
          }}
        >
          <div
            style={{
              maxWidth: '1280px',
              width: '100%',
              margin: '0 auto',
              padding: '0 24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '4rem',
              alignItems: 'center',
            }}
          >
            {/* Left: text */}
            <div>
              <div className="eyebrow" style={{ marginBottom: '1.5rem' }}>
                Materials
              </div>
              <h2
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 'clamp(2.5rem, 4vw, 3.8rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.04em',
                  lineHeight: 1.05,
                  color: '#edf7ee',
                  marginBottom: '1.25rem',
                }}
              >
                Recycle <span className="gradient-text">Today?</span>
              </h2>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '1rem',
                  color: 'rgba(237,247,238,0.5)',
                  lineHeight: 1.7,
                  maxWidth: '420px',
                  marginBottom: '2.5rem',
                }}
              >
                Explore specialized drop-off guidelines and locate nearby
                collection centers tailored to your specific material category.
              </p>

              {/* Category nav */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {materialCards.map((card, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (stackRef.current) {
                        const rect = stackRef.current.getBoundingClientRect();
                        const targetScroll =
                          window.scrollY +
                          rect.top +
                          (i / materialCards.length) *
                            (stackRef.current.offsetHeight - window.innerHeight);
                        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.6rem 1rem',
                      borderRadius: '8px',
                      background:
                        activeCard === i
                          ? 'rgba(74,222,128,0.08)'
                          : 'transparent',
                      border: `1px solid ${activeCard === i ? 'rgba(74,222,128,0.2)' : 'transparent'}`,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textAlign: 'left',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: '0.65rem',
                        color:
                          activeCard === i
                            ? '#4ade80'
                            : 'rgba(237,247,238,0.3)',
                        letterSpacing: '0.1em',
                        minWidth: '28px',
                        transition: 'color 0.3s ease',
                      }}
                    >
                      {card.id}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color:
                          activeCard === i
                            ? '#edf7ee'
                            : 'rgba(237,247,238,0.4)',
                        letterSpacing: '-0.01em',
                        transition: 'color 0.3s ease',
                      }}
                    >
                      {card.title}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: stacked cards */}
            <div
              style={{
                position: 'relative',
                height: '520px',
                perspective: '1200px',
              }}
            >
              {materialCards.map((card, i) => (
                <MaterialCard
                  key={card.id}
                  card={card}
                  index={i}
                  active={activeCard}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────── */}
      <HowItWorks />

      {/* ── Map / Find Center CTA ─────────────────────────────────────── */}
      <MapCTA />

      {/* ── Trust Section ─────────────────────────────────────────────── */}
      <TrustSection />

      {/* ── Statistics / Platform by Numbers ──────────────────────────── */}
      <section
        style={{
          padding: '120px 24px',
          background:
            'linear-gradient(180deg, #06090a 0%, #071209 50%, #06090a 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '800px',
            height: '400px',
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse, rgba(74,222,128,0.05) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '72px' }}>
            <div className="eyebrow" style={{ marginBottom: '1.5rem' }}>Impact</div>
            <h2
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: '#edf7ee',
              }}
            >
              Platform <span className="gradient-text">by the Numbers.</span>
            </h2>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
            }}
          >
            <StatCard num={86} suffix="+" label="Verified Hubs" delay="0s" />
            <StatCard num={49} suffix="" label="Community Rating (÷10 = 4.9★)" delay="0.1s" />
            <StatCard num={5} suffix="" label="Specialized Categories" delay="0.2s" />
            <StatCard num={24} suffix="/7" label="Discovery Platform" delay="0.3s" />
          </div>
        </div>
      </section>

      {/* ── Popular Centers (Integrated real backend data) ────────────── */}
      {popularCenters.length > 0 && (
        <section
          style={{
            padding: '120px 24px',
            background: '#06090a',
          }}
        >
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div className="reveal" style={{ textAlign: 'center', marginBottom: '72px' }}>
              <div className="eyebrow" style={{ marginBottom: '1.5rem' }}>Featured</div>
              <h2
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: '#edf7ee',
                }}
              >
                Popular Drop-off <span className="gradient-text">Centers.</span>
              </h2>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {popularCenters.slice(0, 3).map((center, idx) => (
                <CenterCard key={center.id} center={center} index={idx} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <FAQSection />

      {/* ── Final CTA ────────────────────────────────────────────────── */}
      <FinalCTA />
    </div>
  );
}
