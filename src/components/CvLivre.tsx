// FICHIER: src/components/CvLivre.tsx
//
// CV interactif en forme de livre 3D : couverture rigide qui s'ouvre, pages
// qui se tournent, légère inclinaison suivant la souris. Le contenu reprend
// celui du CV du mémoire (cv-memoire/cv-memoire.html) : mettre les deux à jour
// ensemble.

import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import QRCode from "qrcode";
import { Box, Typography, Button, Stack, IconButton, useMediaQuery } from "@mui/material";
import {
  Download,
  Email,
  Phone,
  LocationOn,
  Facebook,
  LinkedIn,
  GitHub,
  Instagram,
  Close,
  NavigateNext,
  NavigateBefore,
  WorkOutline,
  SchoolOutlined,
  EmojiEventsOutlined,
  Language,
  Verified,
  Cake,
  Public,
} from "@mui/icons-material";

interface CvLivreProps {
  onClose?: () => void;
}

/* ------------------------------------------------------------------ */
/* Charte                                                              */
/* ------------------------------------------------------------------ */

const NAVY = "#0a0a2e";
const BLUE = "#0050FF";
const INK = "#1a1a2e";
const MUTED = "#5b6075";
const LINE = "rgba(10,10,46,0.09)";
const HEADING = "'Poppins', 'Inter', sans-serif";
const BODY = "'Inter', sans-serif";
const MONO = "'Space Grotesk', monospace";

const SPINE = { xs: 18, md: 26 };
const FLIP_MS = 820;
const COVER_MS = 900;

/* ------------------------------------------------------------------ */
/* Contenu (identique au CV du mémoire)                                */
/* ------------------------------------------------------------------ */

const LANGUAGES = [
  { l: "Malagasy", lv: "Langue maternelle", w: 100 },
  { l: "Français", lv: "DELF B2", w: 85 },
  { l: "Anglais", lv: "B2", w: 78 },
];

const EDUCATION = [
  { t: "Licence en Développement d'Applications", s: "EMIT, Université de Fianarantsoa · 3e année", d: "2023 – présent" },
  { t: "Formation Linux Essentials", s: "Bases du système Linux et de la ligne de commande", d: "" },
  { t: "Baccalauréat série C", s: "Lycée FMJ, Talatamaty, Fianarantsoa", d: "2023" },
];

const CERTIFICATES = [
  "Attestation de stage – Développeuse mobile (LovaTech)",
  "Attestation de stage – Développeuse full-stack (L2)",
  "Certification de participation en hackathon",
  "Certificat en informatique bureautique",
  "Attestation Pix",
];

const INTERNSHIP_POINTS = [
  { b: "MajiChrono", t: "livraison à la demande : profils client, livreur et administration, suivi cartographique, preuves photo, signatures, mode hors ligne.", s: "Flutter · Riverpod · Laravel · MySQL" },
  { b: "AllGo", t: "version mobile de la plateforme de commerce social Janga Market.", s: "Flutter · NestJS · Prisma · MySQL · Redis" },
  { b: "DevOps", t: "initiation à Docker, GitHub Actions et au déploiement sur DirectAdmin et o2switch.", s: "" },
];

const HACKATHONS = [
  { n: "MASO", e: "Hackathon FANILO 2026", d: "Plateforme web et PWA d'aide à la vérification de contenus pour les journalistes.", s: "React · Supabase · FastAPI" },
  { n: "Mianara", e: "Science Hack Day", d: "Digitalisation du Baccalauréat avec contrôle anti-fraude par QR code.", s: "Flutter · SQLite · Next.js" },
  { n: "Fianar Smart City", e: "Hackathon Youth Computing", d: "Plateforme citoyenne de signalements urbains avec IA de priorisation.", s: "Next.js · NestJS · PostgreSQL" },
  { n: "UrbanFlow IA", e: "Hackathon EMIHACK", d: "Copilote de trafic urbain avec IA pour Fianarantsoa.", s: "Flutter · OpenStreetMap · React · Python" },
  { n: "Gestion EMIT", e: "Projet académique", d: "Gestion des salles et des emplois du temps avec détection des conflits.", s: "ASP.NET Core · PostgreSQL · React" },
];

const SKILLS = [
  { t: "Mobile", items: ["Flutter", "Dart", "Riverpod", "SQLite / Drift", "PWA"] },
  { t: "Frontend", items: ["React", "Vue.js", "Next.js", "TypeScript", "Tailwind CSS"] },
  { t: "Backend", items: ["PHP / Laravel", "Node.js", "NestJS", "Python / FastAPI", "ASP.NET Core", "Prisma"] },
  { t: "Bases de données", items: ["MySQL", "PostgreSQL", "MongoDB", "Supabase"] },
  { t: "DevOps (débutante)", items: ["Docker", "GitHub Actions", "DirectAdmin", "o2switch"] },
  { t: "Outils", items: ["Git", "Figma", "Vercel", "Netlify", "Render", "Neon"] },
];

const PERSONAL_PROJECTS = [
  { n: "'Parentia", d: "Plateforme parentale collaborative", s: "Vue 3 · Spring Boot" },
  { n: "OuraTable", d: "Réseau social culinaire", s: "Laravel · Vue.js" },
  { n: "FeedbackPro", d: "Application mobile de feedback anonyme", s: "Mobile" },
  { n: "Garage Pro", d: "Gestion de garage", s: "HTML · CSS · JavaScript" },
  { n: "UltimateChild", d: "Site vitrine éducatif", s: "HTML · CSS · JavaScript" },
  { n: "Packet Love Destiny", d: "Mini-jeu interactif", s: "Python · Tkinter" },
  { n: "Portfolio 3D", d: "Portfolio interactif", s: "React · Three.js" },
];

const INTERESTS = ["Cinéma", "Séries", "Basket-ball", "Cuisine", "Sport"];

const SOCIALS = [
  { icon: <Facebook fontSize="small" />, href: "https://web.facebook.com/mariallucia.lucia.35?locale=fr_FR", label: "Facebook" },
  { icon: <LinkedIn fontSize="small" />, href: "https://www.linkedin.com/in/lucia-rasoanirina/", label: "LinkedIn" },
  { icon: <GitHub fontSize="small" />, href: "https://github.com/Lucia-RASOANIRINA", label: "GitHub" },
  { icon: <Instagram fontSize="small" />, href: "https://www.instagram.com/rasoanirinambolatiana", label: "Instagram" },
];

/* ------------------------------------------------------------------ */
/* Typographie des pages                                               */
/* ------------------------------------------------------------------ */

const T = {
  title: { fontFamily: HEADING, fontWeight: 700, color: INK, fontSize: { xs: "0.74rem", sm: "0.82rem", md: "0.95rem" }, lineHeight: 1.3 },
  body: { fontFamily: BODY, color: MUTED, fontSize: { xs: "0.62rem", sm: "0.68rem", md: "0.8rem" }, lineHeight: 1.55 },
  meta: { fontFamily: MONO, color: BLUE, fontWeight: 600, fontSize: { xs: "0.56rem", sm: "0.6rem", md: "0.7rem" }, letterSpacing: 0.3 },
  stack: { fontFamily: MONO, color: "#8a8fa3", fontSize: { xs: "0.54rem", sm: "0.58rem", md: "0.68rem" }, letterSpacing: 0.2 },
};

function Section({ n, title, icon, children }: { n: string; title: string; icon?: ReactNode; children: ReactNode }) {
  return (
    <Box sx={{ mb: { xs: 1.4, md: 2.8 } }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: { xs: 0.8, md: 1.1 } }}>
        <Typography sx={{ fontFamily: MONO, fontSize: { xs: "0.56rem", md: "0.62rem" }, color: BLUE, fontWeight: 700 }}>{n}</Typography>
        <Typography sx={{ fontFamily: HEADING, fontSize: { xs: "0.78rem", sm: "0.86rem", md: "1.08rem" }, fontWeight: 800, color: NAVY, letterSpacing: 0.2 }}>{title}</Typography>
        <Box sx={{ flex: 1, height: "1px", background: `linear-gradient(90deg, ${LINE}, transparent)` }} />
        {icon && <Box sx={{ color: BLUE, display: "flex", "& svg": { fontSize: { xs: 15, md: 17 } } }}>{icon}</Box>}
      </Stack>
      {children}
    </Box>
  );
}

function Chip({ children, strong = false }: { children: ReactNode; strong?: boolean }) {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-block",
        fontFamily: BODY,
        fontWeight: 500,
        fontSize: { xs: "0.56rem", sm: "0.6rem", md: "0.72rem" },
        px: { xs: 0.8, md: 1 },
        py: 0.25,
        borderRadius: 1.2,
        color: strong ? "#fff" : NAVY,
        bgcolor: strong ? BLUE : "#f2f5fd",
        border: `1px solid ${strong ? BLUE : "rgba(0,80,255,0.12)"}`,
      }}
    >
      {children}
    </Box>
  );
}

/* Entrée de chronologie : point + ligne verticale */
function TimelineItem({ title, meta, children, last = false }: { title: string; meta?: string; children?: ReactNode; last?: boolean }) {
  return (
    <Box sx={{ position: "relative", pl: { xs: 1.8, md: 2.2 }, pb: last ? 0 : { xs: 1, md: 1.8 } }}>
      <Box sx={{ position: "absolute", left: 3, top: 6, bottom: last ? "auto" : -2, height: last ? 0 : "auto", width: "1px", bgcolor: "rgba(0,80,255,0.18)" }} />
      <Box sx={{ position: "absolute", left: 0, top: 3, width: 7, height: 7, borderRadius: "50%", bgcolor: "#fff", border: `2px solid ${BLUE}` }} />
      <Stack direction="row" justifyContent="space-between" alignItems="baseline" spacing={1} flexWrap="wrap">
        <Typography sx={T.title}>{title}</Typography>
        {meta && <Typography sx={{ ...T.meta, whiteSpace: "nowrap" }}>{meta}</Typography>}
      </Stack>
      {children}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Composant principal                                                 */
/* ------------------------------------------------------------------ */

type Panel = { label: string; content: ReactNode };
type Phase = "closed" | "opening" | "open" | "closing";
type Flip = { from: number; to: number; dir: "next" | "prev" };

export default function CvLivre({ onClose }: CvLivreProps) {
  const isDesktop = useMediaQuery("(min-width:900px)");
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [phase, setPhase] = useState<Phase>("closed");
  const [page, setPage] = useState(0);
  const [flip, setFlip] = useState<Flip | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [qrUrl, setQrUrl] = useState("");
  const touchX = useRef<number | null>(null);

  const PORTFOLIO_URL = window.location.origin.includes("localhost")
    ? "https://lucia-rasoanirina-portfolio.netlify.app"
    : window.location.origin;
  const CV_FILE_URL = "/CV_Lucia_Rasoanirina.pdf";

  useEffect(() => {
    QRCode.toDataURL(PORTFOLIO_URL, { width: 260, margin: 1, color: { dark: NAVY, light: "#ffffff" } })
      .then(setQrUrl)
      .catch(() => {});
  }, [PORTFOLIO_URL]);

  // Bloque le défilement de la page derrière le livre
  useEffect(() => {
    const y = window.scrollY;
    Object.assign(document.body.style, { overflow: "hidden", position: "fixed", width: "100%", top: `-${y}px` });
    return () => {
      Object.assign(document.body.style, { overflow: "", position: "", width: "", top: "" });
      window.scrollTo(0, y);
    };
  }, []);

  /* ----------------------------- Panneaux ----------------------------- */

  const profile = (
    <Section n="01" title="Profil">
      <Typography sx={{ ...T.body, color: "#3d4257", fontSize: { xs: "0.66rem", sm: "0.72rem", md: "0.88rem" }, lineHeight: 1.65, mb: { xs: 1, md: 1.4 } }}>
        Développeuse Full-Stack et mobile (Flutter), entrée dans le monde de la technologie en 2023. Stage de trois mois chez
        LovaTech : deux applications mobiles réalisées et premiers pas en DevOps.
      </Typography>
      <Stack spacing={0.6}>
        {[
          { i: <LocationOn />, t: "Ankofafa, Fianarantsoa, Madagascar" },
          { i: <Cake />, t: "Née le 17/10/2005" },
          { i: <Public />, t: "Nationalité malagasy" },
        ].map((x) => (
          <Stack key={x.t} direction="row" spacing={1} alignItems="center" sx={{ "& svg": { fontSize: 15, color: BLUE } }}>
            {x.i}
            <Typography sx={{ ...T.body, color: INK }}>{x.t}</Typography>
          </Stack>
        ))}
      </Stack>
    </Section>
  );

  const languages = (
    <Section n="02" title="Langues" icon={<Language />}>
      <Stack spacing={{ xs: 0.7, md: 0.9 }}>
        {LANGUAGES.map((x) => (
          <Box key={x.l}>
            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ ...T.body, color: INK, fontWeight: 600 }}>{x.l}</Typography>
              <Typography sx={T.meta}>{x.lv}</Typography>
            </Stack>
            <Box sx={{ mt: 0.4, height: 4, borderRadius: 4, bgcolor: "#eef1f8", overflow: "hidden" }}>
              <Box sx={{ width: `${x.w}%`, height: "100%", borderRadius: 4, background: `linear-gradient(90deg, ${BLUE}, #5b8cff)` }} />
            </Box>
          </Box>
        ))}
      </Stack>
    </Section>
  );

  const education = (
    <Section n="03" title="Formation" icon={<SchoolOutlined />}>
      {EDUCATION.map((e, i) => (
        <TimelineItem key={e.t} title={e.t} meta={e.d} last={i === EDUCATION.length - 1}>
          <Typography sx={T.body}>{e.s}</Typography>
        </TimelineItem>
      ))}
    </Section>
  );

  const certificates = (
    <Section n="04" title="Certificats" icon={<Verified />}>
      <Stack spacing={{ xs: 0.55, md: 0.9 }}>
        {CERTIFICATES.map((c) => (
          <Stack key={c} direction="row" spacing={0.9} alignItems="flex-start">
            <Box sx={{ mt: "6px", width: 5, height: 5, borderRadius: "1px", bgcolor: BLUE, transform: "rotate(45deg)", flexShrink: 0 }} />
            <Typography sx={{ ...T.body, color: INK }}>{c}</Typography>
          </Stack>
        ))}
      </Stack>
    </Section>
  );

  const experience = (
    <Section n="05" title="Expériences professionnelles" icon={<WorkOutline />}>
      <TimelineItem title="Stage · Développeuse mobile Flutter" meta="03/08 – 31/10/2026">
        <Typography sx={{ ...T.meta, mb: 0.6 }}>LovaTech</Typography>
        <Stack spacing={{ xs: 0.6, md: 0.8 }}>
          {INTERNSHIP_POINTS.map((p) => (
            <Box key={p.b} sx={{ p: { xs: 0.8, md: 1 }, borderRadius: 1.5, bgcolor: "#f7f9ff", border: `1px solid ${LINE}` }}>
              <Typography sx={T.body}>
                <Box component="span" sx={{ color: INK, fontWeight: 700 }}>{p.b}</Box> : {p.t}
              </Typography>
              {p.s && <Typography sx={{ ...T.stack, mt: 0.3 }}>{p.s}</Typography>}
            </Box>
          ))}
        </Stack>
      </TimelineItem>
      <TimelineItem title="Stage de L2 · Développeuse full-stack" meta="2 mois" last>
        <Typography sx={T.body}>Application de gestion d'une maison de production audio.</Typography>
      </TimelineItem>
    </Section>
  );

  const hackathonList = (items: typeof HACKATHONS) => (
    <Section n="06" title="Hackathons et projets de groupe" icon={<EmojiEventsOutlined />}>
      <Stack spacing={{ xs: 0.7, md: 0.9 }}>
        {items.map((h) => (
          <Box key={h.n} sx={{ position: "relative", pl: { xs: 1.2, md: 1.4 }, py: { xs: 0.5, md: 0.6 }, borderLeft: `2px solid ${BLUE}`, bgcolor: "#fafbff", borderRadius: "0 8px 8px 0" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" spacing={1}>
              <Typography sx={T.title}>{h.n}</Typography>
              <Typography sx={{ ...T.meta, textAlign: "right" }}>{h.e}</Typography>
            </Stack>
            <Typography sx={T.body}>{h.d}</Typography>
            <Typography sx={{ ...T.stack, mt: 0.2 }}>{h.s}</Typography>
          </Box>
        ))}
      </Stack>
    </Section>
  );

  const skills = (
    <Section n="07" title="Compétences techniques">
      <Stack spacing={{ xs: 0.9, md: 1.6 }}>
        {SKILLS.map((g) => (
          <Box key={g.t}>
            <Typography sx={{ ...T.meta, color: NAVY, fontWeight: 700, mb: 0.5, textTransform: "uppercase", letterSpacing: 1 }}>{g.t}</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {g.items.map((s, i) => (
                <Chip key={s} strong={i === 0}>{s}</Chip>
              ))}
            </Box>
          </Box>
        ))}
      </Stack>
    </Section>
  );

  const projects = (items: typeof PERSONAL_PROJECTS) => (
    <Section n="08" title="Projets personnels">
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: { xs: 0.7, md: 0.9 } }}>
        {items.map((p) => (
          <Box key={p.n} sx={{ p: { xs: 0.8, md: 1.1 }, borderRadius: 1.5, border: `1px solid ${LINE}`, bgcolor: "#fff", boxShadow: "0 1px 0 rgba(10,10,46,0.03)" }}>
            <Typography sx={T.title}>{p.n}</Typography>
            <Typography sx={T.body}>{p.d}</Typography>
            <Typography sx={{ ...T.stack, mt: 0.2 }}>{p.s}</Typography>
          </Box>
        ))}
      </Box>
    </Section>
  );

  const contact = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <Typography sx={{ fontFamily: MONO, color: BLUE, fontWeight: 700, letterSpacing: 4, fontSize: { xs: "0.56rem", md: "0.64rem" }, mb: 0.8 }}>
        RESTONS EN CONTACT
      </Typography>
      <Typography sx={{ fontFamily: HEADING, fontWeight: 800, color: NAVY, fontSize: { xs: "1.25rem", md: "1.7rem" }, lineHeight: 1.15, mb: { xs: 1.5, md: 2.2 } }}>
        Merci de votre lecture.
      </Typography>
      <Stack spacing={{ xs: 1, md: 1.3 }} sx={{ mb: { xs: 1.6, md: 2.2 } }}>
        {[
          { i: <Email />, k: "E-mail", v: "luciarasoanirina8@gmail.com" },
          { i: <Phone />, k: "Téléphone", v: "+261 38 39 702 36" },
          { i: <LocationOn />, k: "Localisation", v: "Fianarantsoa, Madagascar" },
          { i: <GitHub />, k: "GitHub", v: "github.com/Lucia-RASOANIRINA" },
        ].map((c) => (
          <Stack key={c.k} direction="row" spacing={1.3} alignItems="center">
            <Box sx={{ width: { xs: 28, md: 34 }, height: { xs: 28, md: 34 }, borderRadius: 1.5, display: "grid", placeItems: "center", bgcolor: "#f2f5fd", color: BLUE, "& svg": { fontSize: { xs: 15, md: 18 } } }}>{c.i}</Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ ...T.stack, textTransform: "uppercase", letterSpacing: 1 }}>{c.k}</Typography>
              <Typography sx={{ ...T.body, color: INK, fontWeight: 600, wordBreak: "break-word" }}>{c.v}</Typography>
            </Box>
          </Stack>
        ))}
      </Stack>
      <Typography sx={{ ...T.meta, color: NAVY, textTransform: "uppercase", letterSpacing: 1, mb: 0.6 }}>Centres d'intérêt</Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: { xs: 1.4, md: 2 } }}>
        {INTERESTS.map((x) => <Chip key={x}>{x}</Chip>)}
      </Box>
      <Stack direction="row" spacing={1}>
        {SOCIALS.map((s) => (
          <IconButton key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
            sx={{ width: 34, height: 34, color: NAVY, border: `1px solid ${LINE}`, transition: "all .25s", "&:hover": { bgcolor: BLUE, color: "#fff", borderColor: BLUE, transform: "translateY(-2px)" } }}>
            {s.icon}
          </IconButton>
        ))}
      </Stack>
    </Box>
  );

  const download = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", position: "relative" }}>
      <Box sx={{ position: "relative", p: 1.4, borderRadius: 3, bgcolor: "#fff", border: `1px solid ${LINE}`, boxShadow: "0 24px 50px -20px rgba(0,80,255,0.35)", transform: "perspective(600px) rotateX(8deg)", mb: 2 }}>
        {qrUrl
          ? <Box component="img" src={qrUrl} alt="QR code vers le portfolio" sx={{ width: { xs: 120, md: 150 }, height: { xs: 120, md: 150 }, display: "block" }} />
          : <Box sx={{ width: { xs: 120, md: 150 }, height: { xs: 120, md: 150 } }} />}
      </Box>
      <Typography sx={{ ...T.body, mb: 2 }}>Scannez pour ouvrir le portfolio</Typography>
      <Button
        component="a"
        href={CV_FILE_URL}
        download="CV_Lucia_Rasoanirina.pdf"
        variant="contained"
        startIcon={<Download />}
        onClick={(e) => e.stopPropagation()}
        sx={{ fontFamily: HEADING, bgcolor: NAVY, borderRadius: 2, px: 3, py: 1.1, fontWeight: 700, textTransform: "none", boxShadow: "0 14px 30px -12px rgba(10,10,46,0.6)", "&:hover": { bgcolor: BLUE } }}
      >
        Télécharger le CV (PDF)
      </Button>
      <Typography sx={{ ...T.stack, mt: 1 }}>2 pages · format A4</Typography>
      <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <Stack direction="row" spacing={0.3} alignItems="flex-end" sx={{ height: 22 }}>
          {[2, 1, 1, 3, 1, 2, 1, 1, 3, 2, 1, 1, 2, 1, 3].map((w, i) => (
            <Box key={i} sx={{ width: w, height: i % 4 === 0 ? "100%" : "65%", bgcolor: NAVY, opacity: 0.8 }} />
          ))}
        </Stack>
        <Typography sx={T.stack}>CV · 2026 · LR</Typography>
      </Box>
    </Box>
  );

  const panels: Panel[] = [
    { label: "Profil", content: <>{profile}{languages}</> },
    { label: "Formation", content: <>{education}{certificates}</> },
    { label: "Expérience", content: experience },
    { label: "Hackathons", content: hackathonList(HACKATHONS) },
    { label: "Compétences", content: skills },
    { label: "Projets", content: projects(PERSONAL_PROJECTS) },
    { label: "Contact", content: contact },
    { label: "CV", content: download },
  ];

  // Mobile : un panneau par page ; ordinateur : deux panneaux par double page
  const sheets = panels;
  const pageCount = isDesktop ? Math.ceil(sheets.length / 2) : sheets.length;

  useEffect(() => {
    if (page > pageCount - 1) setPage(pageCount - 1);
  }, [page, pageCount]);

  /* ----------------------------- Navigation ----------------------------- */

  const flipMs = reduceMotion ? 1 : FLIP_MS;
  const coverMs = reduceMotion ? 1 : COVER_MS;

  const goTo = (to: number) => {
    if (flip || phase !== "open" || to < 0 || to > pageCount - 1 || to === page) return;
    setFlip({ from: page, to, dir: to > page ? "next" : "prev" });
    window.setTimeout(() => {
      setPage(to);
      setFlip(null);
    }, flipMs);
  };
  const next = () => goTo(page + 1);
  const prev = () => goTo(page - 1);

  const openBook = () => {
    if (phase !== "closed") return;
    setPhase("opening");
    window.setTimeout(() => setPhase("open"), coverMs);
  };
  const closeBook = () => {
    if (phase !== "open" || flip) return;
    setPhase("closing");
    window.setTimeout(() => {
      setPhase("closed");
      setPage(0);
    }, coverMs);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
      else if (phase === "closed" && (e.key === "ArrowRight" || e.key === "Enter")) openBook();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") (page === 0 ? closeBook() : prev());
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const onMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (!isDesktop || reduceMotion) return;
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({ x: ((e.clientX - r.left) / r.width - 0.5) * 2, y: ((e.clientY - r.top) / r.height - 0.5) * 2 });
  };

  /* ----------------------------- Rendu des pages ----------------------------- */

  const sheet = (i: number, side: "left" | "right" | "single") => {
    const s = sheets[i];
    if (!s) return <Paper side={side} />;
    return (
      <Paper side={side} label={s.label} number={i + 1} total={sheets.length}>
        {s.content}
      </Paper>
    );
  };

  // Couches visibles selon l'état du feuilletage
  let staticLeft: ReactNode = null;
  let staticRight: ReactNode = null;
  let leafFront: ReactNode = null;
  let leafBack: ReactNode = null;
  if (isDesktop) {
    const L = (p: number) => sheet(p * 2, "left");
    const R = (p: number) => sheet(p * 2 + 1, "right");
    if (!flip) {
      staticLeft = L(page);
      staticRight = R(page);
    } else if (flip.dir === "next") {
      staticLeft = L(flip.from);
      staticRight = R(flip.to);
      leafFront = R(flip.from);
      leafBack = L(flip.to);
    } else {
      staticLeft = L(flip.to);
      staticRight = R(flip.from);
      leafFront = R(flip.to);
      leafBack = L(flip.from);
    }
  } else {
    const P = (p: number) => sheet(p, "single");
    if (!flip) staticRight = P(page);
    else if (flip.dir === "next") {
      staticRight = P(flip.to);
      leafFront = P(flip.from);
      leafBack = <Paper side="single" />;
    } else {
      staticRight = P(flip.from);
      leafFront = P(flip.to);
      leafBack = <Paper side="single" />;
    }
  }

  const showPages = phase !== "closed";
  const showCover = phase !== "open";
  const tiltX = phase === "closed" ? -tilt.y * 5 : -tilt.y * 3;
  const tiltY = phase === "closed" ? tilt.x * 8 - 4 : tilt.x * 4;

  return (
    <Box
      role="dialog"
      aria-modal="true"
      aria-label="CV de Lucia Rasoanirina"
      onMouseMove={onMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) < 50) return;
        if (phase === "closed") { if (dx < 0) openBook(); return; }
        if (dx < 0) next(); else (page === 0 ? closeBook() : prev());
      }}
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 1, sm: 2, md: 3 },
        background: `radial-gradient(ellipse at 50% 35%, #16205a 0%, ${NAVY} 45%, #03030f 100%)`,
        animation: "cvFadeIn .4s ease",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse at center, #000 30%, transparent 75%)",
          pointerEvents: "none",
        },
      }}
    >
      {/* Fermer */}
      <IconButton
        onClick={onClose}
        aria-label="Fermer le CV"
        sx={{ position: "absolute", top: { xs: 10, md: 18 }, right: { xs: 10, md: 18 }, zIndex: 40, color: "#fff", border: "1px solid rgba(255,255,255,0.18)", bgcolor: "rgba(255,255,255,0.06)", backdropFilter: "blur(8px)", transition: "all .3s", "&:hover": { bgcolor: "rgba(255,255,255,0.16)", transform: "rotate(90deg)" } }}
      >
        <Close />
      </IconButton>

      {/* Scène 3D */}
      <Box sx={{ width: { xs: "100%", md: "calc(100% - 64px)" }, maxWidth: 1060, height: { xs: "80vh", md: "80vh" }, maxHeight: 760, perspective: "2400px", position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            transformStyle: "preserve-3d",
            transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
            transition: "transform .5s cubic-bezier(.2,.8,.2,1)",
            animation: "cvBookIn .7s cubic-bezier(.2,.9,.3,1.1)",
          }}
        >
          {/* Ombre au sol */}
          <Box sx={{ position: "absolute", left: "6%", right: "6%", bottom: -34, height: 40, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,0,0,0.55), transparent 70%)", filter: "blur(10px)", transform: "translateZ(-60px)" }} />

          {/* Plat arrière (couverture rigide visible autour des pages) */}
          <Box sx={{ position: "absolute", inset: 0, borderRadius: "6px 14px 14px 6px", background: "linear-gradient(135deg, #121a4a, #070722)", boxShadow: "0 50px 100px -30px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.06)" }} />

          {/* Tranche des feuilles (épaisseur) */}
          <Box sx={{ position: "absolute", top: 10, bottom: 10, right: 2, width: 9, borderRadius: "0 4px 4px 0", background: "repeating-linear-gradient(90deg, #f4f1ea 0 1px, #dcd6ca 1px 2px)", boxShadow: "inset -1px 0 2px rgba(0,0,0,0.15)" }} />

          {/* Dos */}
          <Box sx={{ position: "absolute", left: 0, top: 0, bottom: 0, width: SPINE, zIndex: 6, borderRadius: "6px 0 0 6px", background: "linear-gradient(90deg, #04041a, #10185a 45%, #070726)", boxShadow: "inset -3px 0 6px rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <Typography sx={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontFamily: MONO, color: "rgba(255,255,255,0.55)", letterSpacing: 5, fontSize: { xs: "0.45rem", md: "0.55rem" }, whiteSpace: "nowrap" }}>
              LUCIA RASOANIRINA · CURRICULUM VITAE · 2026
            </Typography>
          </Box>

          {/* Bloc de pages */}
          {showPages && (
            <Box sx={{ position: "absolute", left: SPINE, right: 10, top: 8, bottom: 8, zIndex: 2, display: "flex", borderRadius: "2px 10px 10px 2px", overflow: "hidden", bgcolor: "#fdfdfb" }}>
              {isDesktop ? (
                <>
                  <Box sx={{ width: "50%", height: "100%" }}>{staticLeft}</Box>
                  <Box sx={{ width: "50%", height: "100%" }}>{staticRight}</Box>
                  {/* Pli central */}
                  <Box sx={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 40, transform: "translateX(-50%)", background: "linear-gradient(90deg, transparent, rgba(10,10,46,0.10) 45%, rgba(10,10,46,0.18) 50%, rgba(10,10,46,0.10) 55%, transparent)", pointerEvents: "none", zIndex: 3 }} />
                </>
              ) : (
                <Box sx={{ width: "100%", height: "100%" }}>{staticRight}</Box>
              )}

              {/* Feuille qui tourne */}
              {flip && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    right: 0,
                    width: isDesktop ? "50%" : "100%",
                    zIndex: 5,
                    transformStyle: "preserve-3d",
                    transformOrigin: "left center",
                    animation: `${flip.dir === "next" ? "cvLeafNext" : "cvLeafPrev"} ${flipMs}ms cubic-bezier(.45,.05,.35,1) forwards`,
                  }}
                >
                  <Box sx={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", boxShadow: "-10px 0 30px rgba(0,0,0,0.15)" }}>
                    {leafFront}
                    <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(90deg, rgba(0,0,0,0.18), transparent 30%)", animation: `cvShade ${flipMs}ms ease forwards` }} />
                  </Box>
                  <Box sx={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                    {leafBack}
                    <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(270deg, rgba(0,0,0,0.18), transparent 30%)", animation: `cvShade ${flipMs}ms ease forwards` }} />
                  </Box>
                </Box>
              )}

              {/* Zones cliquables de navigation */}
              {phase === "open" && !flip && (
                <>
                  <Box onClick={page === 0 ? closeBook : prev} aria-hidden sx={{ position: "absolute", left: 0, top: 50, bottom: 50, width: "7%", zIndex: 8, cursor: "pointer", display: "flex", alignItems: "center", color: "transparent", transition: "all .3s", "&:hover": { color: BLUE, background: "linear-gradient(90deg, rgba(0,80,255,0.07), transparent)" } }}>
                    <NavigateBefore sx={{ fontSize: { xs: 26, md: 34 } }} />
                  </Box>
                  {page < pageCount - 1 && (
                    <Box onClick={next} aria-hidden sx={{ position: "absolute", right: 0, top: 50, bottom: 50, width: "7%", zIndex: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "flex-end", color: "transparent", transition: "all .3s", "&:hover": { color: BLUE, background: "linear-gradient(270deg, rgba(0,80,255,0.07), transparent)" } }}>
                      <NavigateNext sx={{ fontSize: { xs: 26, md: 34 } }} />
                    </Box>
                  )}
                </>
              )}
            </Box>
          )}

          {/* Couverture rigide */}
          {showCover && (
            <Box
              onClick={openBook}
              sx={{
                position: "absolute",
                left: SPINE,
                right: 0,
                top: 0,
                bottom: 0,
                zIndex: 10,
                cursor: phase === "closed" ? "pointer" : "default",
                transformStyle: "preserve-3d",
                transformOrigin: "left center",
                animation:
                  phase === "opening" ? `cvCoverOpen ${coverMs}ms cubic-bezier(.55,.05,.3,1) forwards`
                  : phase === "closing" ? `cvCoverClose ${coverMs}ms cubic-bezier(.55,.05,.3,1) forwards`
                  : "none",
              }}
            >
              <Cover />
            </Box>
          )}
        </Box>
      </Box>

      {/* Barre de navigation */}
      <Stack direction="row" alignItems="center" spacing={{ xs: 1, md: 1.5 }} sx={{ mt: { xs: 2, md: 3 }, zIndex: 1, color: "#fff" }}>
        {phase === "closed" ? (
          <Button onClick={openBook} endIcon={<NavigateNext />} sx={{ fontFamily: HEADING, textTransform: "none", fontWeight: 600, color: "#fff", borderRadius: 5, px: 2.5, border: "1px solid rgba(255,255,255,0.2)", bgcolor: "rgba(255,255,255,0.06)", "&:hover": { bgcolor: BLUE, borderColor: BLUE } }}>
            Ouvrir le CV
          </Button>
        ) : (
          <>
            <IconButton aria-label="Page précédente" onClick={page === 0 ? closeBook : prev} disabled={phase !== "open"} sx={navBtn}>
              <NavigateBefore />
            </IconButton>
            <Stack direction="row" spacing={0.7} alignItems="center">
              {Array.from({ length: pageCount }, (_, i) => (
                <Box key={i} component="button" aria-label={`Aller à la page ${i + 1}`} onClick={() => goTo(i)}
                  sx={{ p: 0, border: 0, cursor: "pointer", height: 6, borderRadius: 3, width: i === page ? 22 : 6, bgcolor: i === page ? BLUE : "rgba(255,255,255,0.3)", transition: "all .35s" }} />
              ))}
            </Stack>
            <Typography sx={{ fontFamily: MONO, fontSize: "0.72rem", color: "rgba(255,255,255,0.6)", minWidth: 44, textAlign: "center" }}>
              {String(page + 1).padStart(2, "0")} / {String(pageCount).padStart(2, "0")}
            </Typography>
            <IconButton aria-label="Page suivante" onClick={next} disabled={phase !== "open" || page >= pageCount - 1} sx={navBtn}>
              <NavigateNext />
            </IconButton>
          </>
        )}
      </Stack>

      <style>{`
        @keyframes cvFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes cvBookIn { from { opacity: 0; transform: translateY(40px) rotateX(18deg) scale(.92) } to { opacity: 1 } }
        @keyframes cvCoverOpen {
          0% { transform: perspective(2400px) rotateY(0deg); opacity: 1 }
          70% { opacity: 1 }
          100% { transform: perspective(2400px) rotateY(-125deg); opacity: 0 }
        }
        @keyframes cvCoverClose {
          0% { transform: perspective(2400px) rotateY(-125deg); opacity: 0 }
          30% { opacity: 1 }
          100% { transform: perspective(2400px) rotateY(0deg); opacity: 1 }
        }
        @keyframes cvLeafNext { from { transform: perspective(2400px) rotateY(0deg) } to { transform: perspective(2400px) rotateY(-180deg) } }
        @keyframes cvLeafPrev { from { transform: perspective(2400px) rotateY(-180deg) } to { transform: perspective(2400px) rotateY(0deg) } }
        @keyframes cvShade { 0% { opacity: 0 } 50% { opacity: 1 } 100% { opacity: 0 } }
        @keyframes cvFloat { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
        @keyframes cvSheen { 0% { transform: translateX(-120%) skewX(-18deg) } 100% { transform: translateX(260%) skewX(-18deg) } }
      `}</style>
    </Box>
  );
}

const navBtn = {
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.2)",
  bgcolor: "rgba(255,255,255,0.06)",
  "&:hover": { bgcolor: BLUE, borderColor: BLUE },
  "&.Mui-disabled": { color: "rgba(255,255,255,0.25)" },
};

/* ------------------------------------------------------------------ */
/* Feuille de papier                                                   */
/* ------------------------------------------------------------------ */

function Paper({ side, label, number, total, children }: { side: "left" | "right" | "single"; label?: string; number?: number; total?: number; children?: ReactNode }) {
  // Ombre de reliure du côté du pli
  const gutter =
    side === "left" ? "linear-gradient(270deg, rgba(10,10,46,0.06), transparent 8%)"
    : side === "right" ? "linear-gradient(90deg, rgba(10,10,46,0.06), transparent 8%)"
    : "linear-gradient(90deg, rgba(10,10,46,0.07), transparent 5%)";
  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%", bgcolor: "#fdfdfb", backgroundImage: gutter, display: "flex", flexDirection: "column" }}>
      {label && (
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: { xs: 2, sm: 2.5, md: 3.5 }, pt: { xs: 1.4, md: 2 }, pb: { xs: 0.8, md: 1 } }}>
          <Typography sx={{ fontFamily: MONO, fontSize: { xs: "0.52rem", md: "0.58rem" }, letterSpacing: 2.5, color: "#9aa0b4", textTransform: "uppercase" }}>
            Lucia Rasoanirina
          </Typography>
          <Typography sx={{ fontFamily: MONO, fontSize: { xs: "0.52rem", md: "0.58rem" }, letterSpacing: 2.5, color: BLUE, fontWeight: 700, textTransform: "uppercase" }}>
            {label}
          </Typography>
        </Stack>
      )}
      <FitContent>{children}</FitContent>
      {number && (
        <Typography sx={{ fontFamily: MONO, fontSize: "0.56rem", color: "#b4b8c8", textAlign: side === "left" ? "left" : "right", px: { xs: 2, md: 3.5 }, pb: { xs: 1, md: 1.4 } }}>
          {String(number).padStart(2, "0")} — {String(total).padStart(2, "0")}
        </Typography>
      )}
    </Box>
  );
}

/* Réduit légèrement le contenu d'une page s'il ne tient pas en hauteur :
   aucune page ne défile, quelle que soit la taille de l'écran. */
function FitContent({ children }: { children?: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const fit = () => {
      const cs = getComputedStyle(o);
      const avail = o.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      // La largeur dépend de l'échelle et la hauteur de la largeur :
      // recherche dichotomique de la plus grande échelle qui tient.
      const fits = (k: number) => {
        i.style.width = `${100 / k}%`;
        i.style.height = "auto";
        return i.scrollHeight * k <= avail + 0.5;
      };
      let s = 1;
      if (avail > 0 && !fits(1)) {
        let lo = 0.5;
        let hi = 1;
        for (let n = 0; n < 9; n++) {
          const mid = (lo + hi) / 2;
          if (fits(mid)) lo = mid;
          else hi = mid;
        }
        s = lo;
      }
      i.style.width = `${100 / s}%`;
      i.style.height = `${100 / s}%`;
      setScale(s);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(o);
    return () => ro.disconnect();
  }, [children]);

  return (
    <Box ref={outer} sx={{ flex: 1, minHeight: 0, overflow: "hidden", px: { xs: 2, sm: 2.5, md: 3.5 }, py: { xs: 0.6, md: 0.8 } }}>
      <Box ref={inner} data-cv-scale={scale} sx={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
        {children}
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Couverture                                                          */
/* ------------------------------------------------------------------ */

function Cover() {
  return (
    <>
      {/* Face avant */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backfaceVisibility: "hidden",
          borderRadius: "0 14px 14px 0",
          overflow: "hidden",
          background: "linear-gradient(135deg, #18236b 0%, #0c1240 45%, #05051a 100%)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08), inset 12px 0 18px -10px rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          "&:hover .cv-sheen": { animation: "cvSheen 1.2s ease" },
        }}
      >
        {/* Motif et halo */}
        <Box sx={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "18px 18px", maskImage: "linear-gradient(120deg, transparent 20%, #000 80%)" }} />
        <Box sx={{ position: "absolute", width: { xs: 260, md: 520 }, height: { xs: 260, md: 520 }, right: { xs: -80, md: -120 }, top: { xs: -60, md: -140 }, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,80,255,0.45), transparent 65%)", filter: "blur(10px)" }} />
        <Box className="cv-sheen" sx={{ position: "absolute", top: 0, bottom: 0, width: "30%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)", transform: "translateX(-120%) skewX(-18deg)", pointerEvents: "none" }} />
        {/* Filet doré-bleu */}
        <Box sx={{ position: "absolute", inset: { xs: 12, md: 22 }, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 1.5, pointerEvents: "none" }} />

        <Box sx={{ position: "relative", zIndex: 1, width: "100%", height: "100%", display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: "center", justifyContent: { xs: "center", md: "space-between" }, gap: { xs: 3, md: 4 }, px: { xs: 3, sm: 5, md: 8 } }}>
          {/* Photo */}
          <Box sx={{ order: { xs: 0, md: 2 }, position: "relative", animation: "cvFloat 5s ease-in-out infinite" }}>
            <Box sx={{ position: "absolute", inset: -14, borderRadius: "50%", border: "1px dashed rgba(255,255,255,0.18)" }} />
            <Box sx={{ position: "absolute", inset: -28, borderRadius: "50%", border: "1px solid rgba(0,80,255,0.25)" }} />
            <Box
              component="img"
              src="/photo-lucia.jpg"
              alt="Lucia Rasoanirina"
              sx={{ display: "block", width: { xs: 120, sm: 150, md: 220 }, height: { xs: 120, sm: 150, md: 220 }, objectFit: "cover", borderRadius: "50%", border: "4px solid rgba(255,255,255,0.9)", boxShadow: "0 30px 60px -20px rgba(0,0,0,0.8), 0 0 0 10px rgba(0,80,255,0.12)" }}
            />
          </Box>

          {/* Titre */}
          <Box sx={{ order: { xs: 1, md: 1 }, textAlign: { xs: "center", md: "left" }, maxWidth: 480 }}>
            <Typography sx={{ fontFamily: MONO, color: "#7da2ff", letterSpacing: { xs: 4, md: 6 }, fontSize: { xs: "0.6rem", md: "0.72rem" }, fontWeight: 600, mb: { xs: 1, md: 1.5 } }}>
              CURRICULUM VITAE · 2026
            </Typography>
            <Typography sx={{ fontFamily: HEADING, color: "#fff", fontWeight: 800, lineHeight: 0.95, fontSize: { xs: "2rem", sm: "2.6rem", md: "3.6rem" }, letterSpacing: -0.5, textShadow: "0 12px 30px rgba(0,0,0,0.45)" }}>
              Lucia
              <br />
              Rasoanirina
            </Typography>
            <Box sx={{ width: 54, height: 3, borderRadius: 2, bgcolor: BLUE, my: { xs: 1.6, md: 2.2 }, mx: { xs: "auto", md: 0 }, boxShadow: `0 0 18px ${BLUE}` }} />
            <Typography sx={{ fontFamily: HEADING, color: "rgba(255,255,255,0.9)", fontWeight: 600, fontSize: { xs: "0.85rem", md: "1.05rem" } }}>
              Développeuse Full-Stack &amp; Mobile
            </Typography>
            <Typography sx={{ fontFamily: BODY, color: "rgba(255,255,255,0.55)", fontSize: { xs: "0.68rem", md: "0.78rem" }, mt: 0.6 }}>
              Flutter · React · Laravel · NestJS · Fianarantsoa, Madagascar
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent={{ xs: "center", md: "flex-start" }} sx={{ mt: { xs: 2.5, md: 3.5 }, color: "rgba(255,255,255,0.65)" }}>
              <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#22c55e", boxShadow: "0 0 10px #22c55e" }} />
              <Typography sx={{ fontFamily: MONO, fontSize: { xs: "0.6rem", md: "0.68rem" }, letterSpacing: 1.5 }}>CLIQUEZ POUR OUVRIR</Typography>
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* Face intérieure (page de garde) */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          borderRadius: "14px 0 0 14px",
          background: `linear-gradient(135deg, #0c1240, ${NAVY})`,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />
    </>
  );
}
