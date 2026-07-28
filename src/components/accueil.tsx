import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Avatar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  TextField,
  Paper,
  Fade,
  useScrollTrigger,
  Slide,
  CircularProgress,
  Tooltip,
  Alert,
  Snackbar,
  Chip,
  LinearProgress,
  Divider,
  Modal,
  Zoom,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Facebook,
  LinkedIn,
  MailOutline,
  WhatsApp,
  Menu,
  Close,
  PersonOutline,
  Code,
  WorkOutline,
  GitHub,
  Launch,
  AlternateEmail,
  LocationOn,
  Phone,
  KeyboardArrowUp,
  Instagram,
  Copyright,
  Send,
  CheckCircle,
  ErrorOutline,
  CheckCircleOutline,
  School,
  Group,
  DesignServices,
  Storage,
  PhoneAndroid,
  Build,
  Web,
  DataObject,
  InfoOutlined,
  Brush,
  Language,
  Terminal,
  Api,
  Psychology,
  Sensors,
  Download,
  Cloud,
  Analytics,
  Security,
  Map,
  Hub,
  RocketLaunch,
  FilterList,
} from "@mui/icons-material";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { FaDatabase, FaPython, FaReact, FaJava, FaHtml5, FaCss3Alt, FaLaravel, FaVuejs, FaNodeJs, FaJs, FaFigma } from "react-icons/fa";
import { SiTypescript, SiVite, SiExpress, SiMongodb, SiTailwindcss, SiRedux, SiNextdotjs, SiNestjs, SiFlutter, SiSupabase, SiNetlify, SiSharp, SiGo, SiRust, SiSpringboot, SiDjango, SiAngular, SiDocker, SiGithubactions, SiAmazon, SiRedis, SiTensorflow, SiOpenai, SiLinux } from "react-icons/si";
import emailjs from "@emailjs/browser";
import CvLivre from "./CvLivre";

const HEADER_HEIGHT = 70;

// Familles de polices — nécessite le <link> Google Fonts dans index.html (voir notes)
const FONT_HEADING = "'Poppins', 'Inter', sans-serif";
const FONT_MONO = "'Space Grotesk', 'JetBrains Mono', monospace";
const FONT_BODY = "'Inter', 'Space Grotesk', sans-serif";

// Fallback affiché quand une image de projet est introuvable
const PLACEHOLDER_IMG =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'>
      <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='#0a0a2e'/><stop offset='1' stop-color='#0050FF'/>
      </linearGradient></defs>
      <rect width='600' height='400' fill='url(#g)'/>
      <text x='50%' y='48%' fill='rgba(255,255,255,0.85)' font-family='Arial' font-size='28' font-weight='bold' text-anchor='middle'>Preview</text>
      <text x='50%' y='60%' fill='rgba(255,255,255,0.55)' font-family='Arial' font-size='16' text-anchor='middle'>image coming soon</text>
    </svg>`
  );

interface ImageModalProps {
  open: boolean;
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}
interface Competence {
  name: string;
  value: number;
  icon: React.JSX.Element;
  detail: string;
  category: string;
}
interface Project {
  title: string;
  category: string;
  description: string;
  images: string[];
  tags: string[];
  github: string;
  demo: string;
}
interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
interface FormErrors {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const hasSpecialChars = (str: string) => {
  const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  return specialCharsRegex.test(str);
};

// Retour haptique léger (no-op silencieux si l'appareil/navigateur ne le supporte pas)
const vibrate = (pattern: number | number[] = 15) => {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      /* ignore */
    }
  }
};

// Détection d'orientation (portrait/paysage), utilisée pour adapter certaines mises en page mobiles
function useOrientation() {
  const getOrientation = () =>
    typeof window !== "undefined" && window.matchMedia("(orientation: portrait)").matches ? "portrait" : "landscape";
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(getOrientation());
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(orientation: portrait)");
    const handler = () => setOrientation(getOrientation());
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);
  return orientation;
}

/* ============================================================
   NOUVEAUX COMPOSANTS UTILITAIRES — Animations & UX
   ============================================================ */

// Loader plein écran affiché au premier montage (logo LR animé)
function PageLoader({ visible }: { visible: boolean }) {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 3000,
        bgcolor: "#050510",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        transition: "opacity 0.6s ease, visibility 0.6s ease",
        opacity: visible ? 1 : 0,
        visibility: visible ? "visible" : "hidden",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <Box
        sx={{
          width: 84,
          height: 84,
          borderRadius: "24px",
          bgcolor: "#0050FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONT_HEADING,
          fontWeight: 800,
          fontSize: 30,
          color: "#fff",
          boxShadow: "0 0 40px rgba(0,80,255,0.7)",
          animation: "loaderPulse 1.4s ease-in-out infinite",
        }}
      >
        LR
      </Box>
      <Box sx={{ width: 160, height: 3, bgcolor: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
        <Box sx={{ height: "100%", width: "40%", bgcolor: "#0050FF", borderRadius: 4, animation: "loaderBar 1.2s ease-in-out infinite" }} />
      </Box>
      <Typography sx={{ color: "rgba(255,255,255,0.5)", fontFamily: FONT_MONO, fontSize: 12, letterSpacing: "0.25em" }}>
        LOADING PORTFOLIO
      </Typography>
    </Box>
  );
}

// Barre de progression de lecture (scroll global de la page)
function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrollable = h.scrollHeight - h.clientHeight;
      setProgress(scrollable > 0 ? (h.scrollTop / scrollable) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <Box
      sx={{
        position: "fixed",
        top: HEADER_HEIGHT,
        left: 0,
        width: "100%",
        height: 3,
        zIndex: 99,
        bgcolor: "transparent",
        pointerEvents: "none",
      }}
    >
      <Box
        sx={{
          height: "100%",
          width: `${progress}%`,
          background: "linear-gradient(90deg, #0050FF, #00bfff)",
          transition: "width 0.1s linear",
          boxShadow: "0 0 8px rgba(0,80,255,0.6)",
        }}
      />
    </Box>
  );
}

// Points de navigation latérale (desktop uniquement)
function SideNavDots({
  items,
  activeSection,
  onSelect,
}: {
  items: readonly { id: string; label: string }[];
  activeSection: string;
  onSelect: (id: string) => void;
}) {
  return (
    <Stack
      spacing={2}
      sx={{
        position: "fixed",
        right: 28,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 90,
        display: { xs: "none", lg: "flex" },
      }}
    >
      {items.map((item) => {
        const active = activeSection === item.id;
        return (
          <Tooltip key={item.id} title={item.label} placement="left" arrow>
            <Box
              onClick={() => onSelect(item.id)}
              sx={{
                width: active ? 12 : 8,
                height: active ? 12 : 8,
                borderRadius: "50%",
                bgcolor: active ? "#0050FF" : "rgba(0,0,0,0.2)",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.2,0.9,0.4,1.1)",
                boxShadow: active ? "0 0 0 4px rgba(0,80,255,0.2)" : "none",
                "&:hover": { bgcolor: "#0050FF", transform: "scale(1.3)" },
              }}
            />
          </Tooltip>
        );
      })}
    </Stack>
  );
}

// Effet de frappe (typing effect) pour le rôle
function TypingText({ text, speed = 55 }: { text: string; speed?: number }) {
  const [display, setDisplay] = useState("");
  useEffect(() => {
    setDisplay("");
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setDisplay(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return (
    <Box component="span" sx={{ borderRight: "2px solid #0050FF", animation: "caretBlink 0.9s step-end infinite", pr: 0.5 }}>
      {display}
    </Box>
  );
}

// Compteur animé (déclenché à l'entrée dans le viewport)
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !done.current) {
          done.current = true;
          const duration = 1200;
          const start = performance.now();
          const step = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            setN(Math.floor(p * value));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value]);
  return (
    <Typography
      ref={ref}
      component="span"
      sx={{ fontWeight: 800, fontSize: { xs: 34, sm: 42 }, color: "#0050FF", fontFamily: FONT_HEADING }}
    >
      {n}
      {suffix}
    </Typography>
  );
}

// Révélation générique au scroll — variantes: fade-up, slide-in, scale-in
type RevealVariant = "fade-up" | "slide-in" | "scale-in";
function Reveal({
  children,
  variant = "fade-up",
  delay = 0,
}: {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const hiddenTransform =
    variant === "fade-up" ? "translateY(36px)" : variant === "slide-in" ? "translateX(-48px)" : "scale(0.88)";
  return (
    <Box
      ref={ref}
      sx={{
        transition: "opacity 0.7s cubic-bezier(0.2,0.9,0.3,1.1), transform 0.7s cubic-bezier(0.2,0.9,0.3,1.1)",
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : hiddenTransform,
      }}
    >
      {children}
    </Box>
  );
}

// Révélation 3D au scroll : la section bascule en perspective puis se redresse
function Reveal3D({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <Box ref={ref} sx={{ perspective: "1200px" }}>
      <Box
        sx={{
          transformStyle: "preserve-3d",
          transition: "opacity 0.8s ease, transform 0.8s cubic-bezier(0.2, 0.9, 0.3, 1.2)",
          transitionDelay: `${delay}ms`,
          opacity: visible ? 1 : 0,
          transform: visible
            ? "rotateX(0deg) translateY(0) translateZ(0)"
            : "rotateX(-38deg) translateY(50px) translateZ(-80px)",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

// Carte projet avec effet de lumière qui suit la souris (glow) + profondeur 3D
function GlowCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [hover, setHover] = useState(false);
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  };
  return (
    <Box
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{ position: "relative", height: "100%" }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          borderRadius: 5,
          pointerEvents: "none",
          zIndex: 2,
          opacity: hover ? 1 : 0,
          transition: "opacity 0.3s ease",
          background: `radial-gradient(280px circle at ${pos.x}% ${pos.y}%, rgba(0,80,255,0.22), transparent 60%)`,
        }}
      />
      {children}
    </Box>
  );
}

function SkillCard({ skill, openSkillDetail, setOpenSkillDetail, moreLabel, lessLabel }: {
  skill: Competence;
  openSkillDetail: string | null;
  setOpenSkillDetail: (value: string | null) => void;
  moreLabel: string;
  lessLabel: string;
}) {
  const [progressValue, setProgressValue] = useState(0);
  const skillRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime: number | null = null;
          const duration = 600;
          const targetValue = skill.value;
          const step = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            setProgressValue(Math.floor(progress * targetValue));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        } else if (!entries[0].isIntersecting) {
          setHasAnimated(false);
          setProgressValue(0);
        }
      },
      { threshold: 0.2 }
    );
    if (skillRef.current) observer.observe(skillRef.current);
    return () => observer.disconnect();
  }, [skill.value, hasAnimated]);
  const isOpen = openSkillDetail === skill.name;
  const shortDetail = skill.detail.length > 80 ? skill.detail.substring(0, 80) + "..." : skill.detail;
  return (
    <Zoom in={true} timeout={400} style={{ transitionDelay: `${Math.random() * 200}ms` }}>
      <Box
        ref={skillRef}
        sx={{
          bgcolor: "rgba(244,240,237,0.85)",
          backdropFilter: "blur(6px)",
          border: "1px solid rgba(255,255,255,0.5)",
          p: 2.5,
          borderRadius: 3,
          transition: "all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)",
          "&:hover": {
            transform: "translateY(-4px) scale(1.01)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          },
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box sx={{ fontSize: 28, color: "#0050FF" }}>{skill.icon}</Box>
            <Typography fontWeight={700} fontSize={15} color="#000" fontFamily={FONT_HEADING}>{skill.name}</Typography>
          </Stack>
          <Typography fontWeight={700} color="#0050FF" fontSize={14}>
            {progressValue}%
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={progressValue}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: "#e0e0e0",
            mb: 1.5,
            "& .MuiLinearProgress-bar": {
              bgcolor: "#0050FF",
              borderRadius: 4,
              background: "linear-gradient(90deg, #0050FF, #4f8cff)",
              transition: "transform 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
            },
          }}
        />
        <Typography fontSize={12} color="#555" lineHeight={1.5} sx={{ mb: 1 }}>
          {isOpen ? skill.detail : shortDetail}
        </Typography>
        {skill.detail.length > 80 && (
          <Button
            size="small"
            onClick={() => setOpenSkillDetail(isOpen ? null : skill.name)}
            sx={{
              color: "#0050FF",
              textTransform: "none",
              p: 0,
              minWidth: "auto",
              fontWeight: 500,
              fontSize: "0.75rem",
              transition: "all 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1)",
              "&:hover": { bgcolor: "transparent", color: "#003bb5", transform: "translateX(2px)" },
            }}
          >
            <InfoOutlined sx={{ fontSize: 14, mr: 0.5, transition: "transform 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1)" }} />
            {isOpen ? lessLabel : moreLabel}
          </Button>
        )}
      </Box>
    </Zoom>
  );
}

function ImageModal({ open, images, currentIndex, onClose, onNext, onPrev }: ImageModalProps) {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  if (!open || !images.length) return null;
  const currentImage = images[currentIndex];

  // Swipe tactile : glisser à gauche/droite pour naviguer entre les images
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0 && currentIndex < images.length - 1) {
        vibrate(10);
        onNext();
      } else if (dx > 0 && currentIndex > 0) {
        vibrate(10);
        onPrev();
      }
    }
  };

  return (
    <Modal open={open} onClose={onClose} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Zoom in={open} timeout={300}>
        <Box
          sx={{
            position: "relative",
            maxWidth: "85vw",
            maxHeight: "85vh",
            bgcolor: "transparent",
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
            outline: "none",
            touchAction: "pan-y",
          }}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={currentImage}
            alt="project preview"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMG; }}
            style={{ maxWidth: "85vw", maxHeight: "85vh", width: "auto", height: "auto", objectFit: "contain", borderRadius: 8, display: "block" }}
          />
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute", top: 16, right: 16, bgcolor: "rgba(0,0,0,0.6)", color: "white",
              transition: "all 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1)",
              "&:hover": { bgcolor: "#0050FF", transform: "scale(1.1)" }, zIndex: 10,
            }}
          >
            <Close />
          </IconButton>
          <IconButton
            onClick={onPrev}
            disabled={currentIndex === 0}
            sx={{
              position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", bgcolor: "rgba(0,0,0,0.6)", color: "white",
              transition: "all 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1)",
              "&:hover": { bgcolor: "#0050FF", transform: "translateY(-50%) scale(1.1)" },
              "&.Mui-disabled": { opacity: 0.3, visibility: "hidden" },
            }}
          >
            <KeyboardArrowUp sx={{ transform: "rotate(-90deg)" }} />
          </IconButton>
          <IconButton
            onClick={onNext}
            disabled={currentIndex === images.length - 1}
            sx={{
              position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", bgcolor: "rgba(0,0,0,0.6)", color: "white",
              transition: "all 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1)",
              "&:hover": { bgcolor: "#0050FF", transform: "translateY(-50%) scale(1.1)" },
              "&.Mui-disabled": { opacity: 0.3, visibility: "hidden" },
            }}
          >
            <KeyboardArrowUp sx={{ transform: "rotate(90deg)" }} />
          </IconButton>
          <Typography sx={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", bgcolor: "rgba(0,0,0,0.6)", color: "white", px: 2, py: 0.5, borderRadius: 20, fontSize: 12 }}>
            {currentIndex + 1} / {images.length}
          </Typography>
        </Box>
      </Zoom>
    </Modal>
  );
}

function ScrollToTop({ bottomOffset = 24 }: { bottomOffset?: number }) {
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 300 });
  const handleClick = () => window.scrollTo({ top: 0, behavior: "smooth" });
  return (
    <Slide direction="up" in={trigger}>
      <IconButton onClick={handleClick} sx={{ position: "fixed", bottom: bottomOffset, right: 24, bgcolor: "#0050FF", color: "white", zIndex: 1000, transition: "all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)", transform: trigger ? "scale(1)" : "scale(0)", "&:hover": { bgcolor: "#003bb5", transform: "scale(1.1) rotate(360deg)", boxShadow: "0 0 15px rgba(0,80,255,0.6)" } }}><KeyboardArrowUp /></IconButton>
    </Slide>
  );
}

// Indicateur "pull to refresh" (mobile) — glisser vers le bas en haut de page pour rafraîchir
function PullToRefresh({ onRefresh }: { onRefresh: () => void }) {
  const [distance, setDistance] = useState(0);
  const [pulling, setPulling] = useState(false);
  const startY = useRef(0);
  const active = useRef(false);
  const THRESHOLD = 70;

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (window.scrollY <= 0) {
        startY.current = e.touches[0].clientY;
        active.current = true;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!active.current) return;
      const delta = e.touches[0].clientY - startY.current;
      if (delta > 0 && window.scrollY <= 0) {
        setPulling(true);
        setDistance(Math.min(delta * 0.5, 90));
      } else {
        active.current = false;
        setPulling(false);
        setDistance(0);
      }
    };
    const onTouchEnd = () => {
      setDistance((current) => {
        if (active.current && current > THRESHOLD) {
          vibrate(20);
          onRefresh();
        }
        return 0;
      });
      active.current = false;
      setPulling(false);
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [onRefresh]);

  return (
    <Box
      sx={{
        position: "fixed",
        top: HEADER_HEIGHT,
        left: 0,
        right: 0,
        display: { xs: "flex", md: "none" },
        justifyContent: "center",
        alignItems: "center",
        height: distance,
        overflow: "hidden",
        transition: pulling ? "none" : "height 0.25s ease",
        zIndex: 98,
        pointerEvents: "none",
      }}
    >
      {distance > 8 && (
        <CircularProgress
          size={22}
          thickness={5}
          variant={distance > THRESHOLD ? "indeterminate" : "determinate"}
          value={Math.min((distance / THRESHOLD) * 100, 100)}
          sx={{ color: "#0050FF", opacity: Math.min(distance / THRESHOLD, 1) }}
        />
      )}
    </Box>
  );
}

// Barre de navigation basse (mobile) — équivalent d'une bottom nav d'app native
function BottomNav({
  items,
  activeSection,
  onSelect,
}: {
  items: readonly { id: string; label: string; icon: React.JSX.Element }[];
  activeSection: string;
  onSelect: (id: string) => void;
}) {
  return (
    <Box
      component="nav"
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        display: { xs: "flex", md: "none" },
        justifyContent: "space-around",
        alignItems: "center",
        bgcolor: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(14px)",
        borderTop: "1px solid rgba(0,80,255,0.15)",
        boxShadow: "0 -6px 20px rgba(0,0,0,0.06)",
        pb: "env(safe-area-inset-bottom)",
        pt: 0.5,
      }}
    >
      {items.map((item) => {
        const active = activeSection === item.id;
        return (
          <Box
            key={item.id}
            onClick={() => {
              vibrate(12);
              onSelect(item.id);
            }}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.3,
              py: 0.8,
              px: 1,
              flex: 1,
              color: active ? "#0050FF" : "#888",
              transition: "color 0.2s ease, transform 0.2s ease",
              transform: active ? "translateY(-2px)" : "none",
              touchAction: "manipulation",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <Box sx={{ fontSize: 20, display: "flex" }}>{item.icon}</Box>
            <Typography sx={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: 0.3 }}>{item.label}</Typography>
            {active && <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "#0050FF" }} />}
          </Box>
        );
      })}
    </Box>
  );
}

export default function Accueil() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [openMenu, setOpenMenu] = useState(false);
  const [openSkillDetail, setOpenSkillDetail] = useState<string | null>(null);
  const [openConnaissanceDetail, setOpenConnaissanceDetail] = useState<string | null>(null);
  const [openProjectDetail, setOpenProjectDetail] = useState<string | null>(null);
  const [openCv, setOpenCv] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [sending, setSending] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState<FormData>({ name: "", email: "", subject: "", message: "" });
  const [formErrors, setFormErrors] = useState<FormErrors>({ name: "", email: "", subject: "", message: "" });
  const [touched, setTouched] = useState({ name: false, email: false, subject: false, message: false });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalCurrentIndex, setModalCurrentIndex] = useState(0);
  const [deployMsg, setDeployMsg] = useState(false);

  // Loader initial
  const [pageLoading, setPageLoading] = useState(true);
  useEffect(() => {
    const finish = () => setTimeout(() => setPageLoading(false), 500);
    if (document.readyState === "complete") finish();
    else {
      window.addEventListener("load", finish);
      return () => window.removeEventListener("load", finish);
    }
  }, []);

  // Header : devient opaque après un léger scroll (plus transparent en haut de page)
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Filtre de projets — par catégorie (Website, Web App, Mobile App, ...), plus par tech
  const [activeCategory, setActiveCategory] = useState<string>("Tous");
  // Filtre de catégorie compétences
  const [activeSkillCategory, setActiveSkillCategory] = useState<string>("Toutes");

  const EMAILJS_CONFIG = {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "",
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "",
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "",
  };

  const TR = {
    en: {
      nav: { about: "ABOUT", connaissances: "KNOWLEDGE", competences: "SKILLS", projects: "PROJECTS", contact: "CONTACT" },
      role: "FULLSTACK DEV",
      openToWork: "OPEN TO WORK",
      hello: "Hello",
      whoami: "// Who I am & what I do",
      downloadCv: "Download CV",
      about: "I entered the world of technology in 2023 as a first-year student in intranet and internet application development. I started my career as a Junior Full-Stack Developer, driven by continuous learning and a strong passion for building modern digital solutions.",
      knowledgeTitle: "Knowledge & Academic Background",
      knowledgeSubtitle: "My technical knowledge acquired during my studies and personal projects",
      groupProjects: "Group Projects",
      skillsTitle: "Technical Skills",
      skillsSubtitle: "Complete expertise in web development - Frontend, Backend & Database",
      projectsTitle: "My Projects",
      contactTitle: "Get In Touch",
      letsWork: "Let's Work Together",
      contactDesc: "I'm available for freelance work, collaborations, or just a chat.",
      available: "Available for on-site and remote",
      fullName: "Full Name", emailLabel: "Email Address", subjectLabel: "Subject", messageLabel: "Message",
      send: "Send Message", sending: "Sending...",
      moreInfo: "More info", showLess: "Show less", code: "Code", demo: "Demo",
      notDeployed: "Not deployed yet",
      notDeployedSub: "This project is not online yet",
      footerDesc: "Fullstack Developer passionate about building modern, scalable, and impactful web applications. Let's create something extraordinary together.",
      navigation: "NAVIGATION", explore: "EXPLORE",
      rights: "2026 Lucia Rasoanirina. All rights reserved.",
      madeIn: "Made with passion in Madagascar",
      langName: "FR",
      all: "All",
      yearsExp: "Years experience",
      projectsDone: "Completed projects",
      techMastered: "Technologies",
    },
    fr: {
      nav: { about: "À PROPOS", connaissances: "CONNAISSANCES", competences: "COMPÉTENCES", projects: "PROJETS", contact: "CONTACT" },
      role: "DÉVELOPPEUSE FULLSTACK",
      openToWork: "DISPONIBLE",
      hello: "Bonjour",
      whoami: "// Qui je suis & ce que je fais",
      downloadCv: "Télécharger le CV",
      about: "Je suis entrée dans le monde de la technologie en 2023, en première année de développement d'applications intranet et internet. J'ai débuté ma carrière comme développeuse Full-Stack junior, animée par un apprentissage continu et une forte passion pour la création de solutions numériques modernes.",
      knowledgeTitle: "Connaissances & Parcours Académique",
      knowledgeSubtitle: "Mes connaissances techniques acquises durant mes études et mes projets personnels",
      groupProjects: "Projets de Groupe",
      skillsTitle: "Compétences Techniques",
      skillsSubtitle: "Expertise complète en développement web - Frontend, Backend & Base de données",
      projectsTitle: "Mes Projets",
      contactTitle: "Me Contacter",
      letsWork: "Travaillons Ensemble",
      contactDesc: "Je suis disponible pour du freelance, des collaborations, ou simplement échanger.",
      available: "Disponible sur site et à distance",
      fullName: "Nom complet", emailLabel: "Adresse email", subjectLabel: "Objet", messageLabel: "Message",
      send: "Envoyer le message", sending: "Envoi...",
      moreInfo: "Plus d'infos", showLess: "Réduire", code: "Code", demo: "Démo",
      notDeployed: "Pas encore déployé",
      notDeployedSub: "Ce projet n'est pas encore en ligne",
      footerDesc: "Développeuse Fullstack passionnée par la création d'applications web modernes, évolutives et impactantes. Créons ensemble quelque chose d'extraordinaire.",
      navigation: "NAVIGATION", explore: "EXPLORER",
      rights: "2026 Lucia Rasoanirina. Tous droits réservés.",
      madeIn: "Réalisé avec passion à Madagascar",
      langName: "EN",
      all: "Tous",
      yearsExp: "Années d'expérience",
      projectsDone: "Projets réalisés",
      techMastered: "Technologies",
    },
  };
  const t = TR.en;

  const handleNoLink = (e: React.MouseEvent) => {
    e.preventDefault();
    setDeployMsg(true);
    window.setTimeout(() => setDeployMsg(false), 2600);
  };

  const menuItems = [
    { id: "about", label: "ABOUT", icon: <PersonOutline /> },
    { id: "connaissances", label: "KNOWLEDGE", icon: <School /> },
    { id: "competences", label: "SKILLS", icon: <Code /> },
    { id: "projects", label: "PROJECTS", icon: <WorkOutline /> },
    { id: "contact", label: "CONTACT", icon: <MailOutline /> },
  ] as const;

  const fullText = t.about;

  // Swipe horizontal (mobile) pour naviguer entre les sections du menu.
  // Ne se déclenche que si le geste est nettement horizontal, pour ne jamais
  // interférer avec le scroll vertical normal de la page.
  const touchNavRef = useRef<{ x: number; y: number } | null>(null);
  const handleSectionTouchStart = (e: React.TouchEvent) => {
    touchNavRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const handleSectionTouchEnd = (e: React.TouchEvent) => {
    if (!touchNavRef.current) return;
    const dx = e.changedTouches[0].clientX - touchNavRef.current.x;
    const dy = e.changedTouches[0].clientY - touchNavRef.current.y;
    touchNavRef.current = null;
    if (Math.abs(dx) > 80 && Math.abs(dx) > Math.abs(dy) * 1.8) {
      const idx = menuItems.findIndex((m) => m.id === activeSection);
      if (dx < 0 && idx < menuItems.length - 1) {
        vibrate(15);
        scrollToSection(menuItems[idx + 1].id);
      } else if (dx > 0 && idx > 0) {
        vibrate(15);
        scrollToSection(menuItems[idx - 1].id);
      }
    }
  };

  const orientation = useOrientation();

  const handlePullRefresh = () => {
    window.location.reload();
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = element.getBoundingClientRect().top + window.pageYOffset - HEADER_HEIGHT - 20;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
    if (isMobile) setOpenMenu(false);
  };

  useEffect(() => {
    const handleActive = () => {
      const scrollPos = window.scrollY + HEADER_HEIGHT + 30;
      for (const item of menuItems) {
        const element = document.getElementById(item.id);
        if (element && scrollPos >= element.offsetTop && scrollPos < element.offsetTop + element.offsetHeight) {
          setActiveSection(item.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleActive);
    handleActive();
    return () => window.removeEventListener("scroll", handleActive);
  }, []);

  const validateName = (name: string) => {
    if (!name.trim()) return "Name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    if (hasSpecialChars(name)) return "No special characters allowed";
    return "";
  };
  const validateEmail = (email: string) => {
    if (!email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email format";
    return "";
  };
  const validateSubject = (subject: string) => {
    if (!subject.trim()) return "Subject is required";
    if (subject.trim().length < 8) return "Subject must be at least 8 characters";
    return "";
  };
  const validateMessage = (message: string) => {
    if (!message.trim()) return "Message is required";
    if (message.trim().length < 10) return "Message must be at least 10 characters";
    return "";
  };
  const capitalizeWords = (str: string) => str.replace(/\b\w/g, (c) => c.toUpperCase());
  const sanitizeInput = (str: string) => str.replace(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g, "");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (hasSpecialChars(val)) val = sanitizeInput(val);
    setFormData((prev) => ({ ...prev, name: val }));
    if (touched.name) setFormErrors((prev) => ({ ...prev, name: validateName(val) }));
  };
  const handleNameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let cap = capitalizeWords(e.target.value);
    if (hasSpecialChars(cap)) cap = sanitizeInput(cap);
    setFormData((prev) => ({ ...prev, name: cap }));
    setTouched((prev) => ({ ...prev, name: true }));
    setFormErrors((prev) => ({ ...prev, name: validateName(cap) }));
  };
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, email: val }));
    if (touched.email) setFormErrors((prev) => ({ ...prev, email: validateEmail(val) }));
  };
  const handleEmailBlur = () => {
    setTouched((prev) => ({ ...prev, email: true }));
    setFormErrors((prev) => ({ ...prev, email: validateEmail(formData.email) }));
  };
  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, subject: val }));
    if (touched.subject) setFormErrors((prev) => ({ ...prev, subject: validateSubject(val) }));
  };
  const handleSubjectBlur = () => {
    setTouched((prev) => ({ ...prev, subject: true }));
    setFormErrors((prev) => ({ ...prev, subject: validateSubject(formData.subject) }));
  };
  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, message: val }));
    if (touched.message) setFormErrors((prev) => ({ ...prev, message: validateMessage(val) }));
  };
  const handleMessageBlur = () => {
    setTouched((prev) => ({ ...prev, message: true }));
    setFormErrors((prev) => ({ ...prev, message: validateMessage(formData.message) }));
  };
  const isFormValid = () => !validateName(formData.name) && !validateEmail(formData.email) && !validateSubject(formData.subject) && !validateMessage(formData.message);

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, subject: true, message: true });
    const errors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      subject: validateSubject(formData.subject),
      message: validateMessage(formData.message),
    };
    setFormErrors(errors);
    if (errors.name || errors.email || errors.subject || errors.message) return;
    if (!EMAILJS_CONFIG.serviceId || !EMAILJS_CONFIG.templateId || !EMAILJS_CONFIG.publicKey) {
      setSnackbar({ open: true, message: "EmailJS configuration missing. Please check your .env file.", severity: "error" });
      return;
    }
    setSending(true);
    try {
      const templateParams = {
        to_email: "luciarasoanirina8@gmail.com",
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
      };
      await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams, EMAILJS_CONFIG.publicKey);
      setSnackbar({ open: true, message: "Message sent successfully!", severity: "success" });
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTouched({ name: false, email: false, subject: false, message: false });
      setFormErrors({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error details:", error);
      setSnackbar({ open: true, message: "Error sending message. Please try again later.", severity: "error" });
    } finally {
      setSending(false);
    }
  };

  const academicKnowledge = [
    { name: "HTML5", icon: <FaHtml5 />, detail: "Semantic structure, accessibility, SEO best practices, modern HTML5 APIs, canvas, SVG, and web components.", category: "Web Fundamentals", level: "Advanced" },
    { name: "CSS3 / Tailwind", icon: <FaCss3Alt />, detail: "Modern layouts, animations, responsive design, CSS variables, utility-first framework.", category: "Styling", level: "Advanced" },
    { name: "JavaScript / React.js", icon: <FaReact />, detail: "Functional components, hooks, state management, Context API, React Router, performance optimization.", category: "Frontend Framework", level: "Advanced" },
    { name: "TypeScript / Vite", icon: <SiTypescript />, detail: "Strict typing, interfaces, generics, advanced types, fast builds, module bundling configuration.", category: "Languages & Tools", level: "Intermediate" },
    { name: "Node.js / Express.js", icon: <SiExpress />, detail: "REST APIs, middleware, JWT authentication, WebSocket, error handling, security best practices.", category: "Backend", level: "Intermediate" },
    { name: "PHP / Laravel", icon: <FaLaravel />, detail: "MVC architecture, Eloquent ORM, artisan commands, authentication, RESTful API development.", category: "Backend", level: "Intermediate" },
    { name: "Python", icon: <FaPython />, detail: "Scripting, data analysis, automation, web scraping, OOP concepts.", category: "Programming Languages", level: "Intermediate" },
    { name: "Java", icon: <FaJava />, detail: "Object-oriented programming, Spring Boot basics, JUnit testing, collections framework.", category: "Programming Languages", level: "Beginner" },
    { name: "MySQL / PostgreSQL", icon: <FaDatabase />, detail: "Complex queries, optimization, indexing, transactions, database design, migrations.", category: "Database", level: "Advanced" },
    { name: "MongoDB", icon: <SiMongodb />, detail: "NoSQL database, aggregation pipelines, indexing, sharding, replica sets, CRUD operations.", category: "Database", level: "Intermediate" },
    { name: "Flutter", icon: <SiFlutter />, detail: "Cross-platform mobile development, Dart programming, widgets, state management, animations, Firebase integration.", category: "Mobile Development", level: "Beginner" },
    { name: "Supabase", icon: <SiSupabase />, detail: "Open-source Firebase alternative, PostgreSQL database, real-time subscriptions, authentication, storage, edge functions.", category: "Backend as a Service", level: "Intermediate" },
    { name: "Netlify", icon: <SiNetlify />, detail: "Continuous deployment, serverless functions, form handling, split testing, analytics, edge CDN.", category: "Deployment & Hosting", level: "Advanced" },
    { name: "Figma", icon: <FaFigma />, detail: "UI/UX design, prototyping, design systems, collaborative design, vector graphics, component libraries.", category: "Design Tools", level: "Intermediate" },
    { name: "Material UI (MUI)", icon: <SiVite />, detail: "Modern component library, custom theming, responsive design system, component customization.", category: "UI Libraries", level: "Advanced" },
    { name: "Redux Toolkit", icon: <SiRedux />, detail: "State management, slices, selectors, async thunks, middleware, devtools integration.", category: "State Management", level: "Intermediate" },
    { name: "Next.js", icon: <SiNextdotjs />, detail: "Server-side rendering, static site generation, API routes, file-based routing, ISR.", category: "Frontend Framework", level: "Beginner" },
    { name: "Angular", icon: <SiAngular />, detail: "Component architecture, RxJS, dependency injection, services, directives, reactive forms, modules.", category: "Frontend Framework", level: "Beginner" },
    { name: "C# / .NET", icon: <SiSharp />, detail: "Object-oriented programming, LINQ, ASP.NET Core, Entity Framework, dependency injection, async programming.", category: "Programming Languages", level: "Beginner" },
    { name: "Go (Golang)", icon: <SiGo />, detail: "Concurrency with goroutines, channels, structs, interfaces, building fast and scalable backend services.", category: "Programming Languages", level: "Beginner" },
    { name: "Rust", icon: <SiRust />, detail: "Memory safety without garbage collection, ownership model, borrowing, traits, high-performance systems programming.", category: "Programming Languages", level: "Beginner" },
    { name: "Spring Boot", icon: <SiSpringboot />, detail: "Java backend framework, REST APIs, dependency injection, JPA/Hibernate, Spring Security, microservices.", category: "Backend", level: "Beginner" },
    { name: "Django / FastAPI", icon: <SiDjango />, detail: "Python web frameworks, ORM, REST APIs, async endpoints, automatic documentation, authentication.", category: "Backend", level: "Intermediate" },
    { name: "React Native", icon: <FaReact />, detail: "Cross-platform mobile apps, native components, navigation, Firebase integration, push notifications, app deployment.", category: "Mobile Development", level: "Intermediate" },
    { name: "Microservices & API Design", icon: <Hub sx={{ color: "#0050FF" }} />, detail: "Service decomposition, REST & gRPC, API gateways, message queues, service discovery, scalable architectures.", category: "Software Architecture", level: "Intermediate" },
    { name: "Docker / Kubernetes", icon: <SiDocker />, detail: "Containerization, images, Docker Compose, orchestration, pods, deployments, scaling, container networking.", category: "DevOps & Cloud", level: "Intermediate" },
    { name: "CI/CD Pipelines", icon: <SiGithubactions />, detail: "GitLab CI/CD, GitHub Actions, automated testing, build & deployment pipelines, DevSecOps practices.", category: "DevOps & Cloud", level: "Intermediate" },
    { name: "Cloud (AWS / Azure / GCP)", icon: <SiAmazon />, detail: "Cloud computing, compute & storage services, serverless functions, distributed infrastructures, IaaS & PaaS.", category: "DevOps & Cloud", level: "Beginner" },
    { name: "Redis / Elasticsearch", icon: <SiRedis />, detail: "In-memory caching, key-value store, pub/sub, full-text search, indexing, real-time analytics.", category: "Database", level: "Beginner" },
    { name: "TensorFlow / PyTorch", icon: <SiTensorflow />, detail: "Deep learning frameworks, neural networks, model training, Scikit-Learn, machine learning pipelines.", category: "AI & Machine Learning", level: "Beginner" },
    { name: "Generative AI & NLP", icon: <SiOpenai />, detail: "OpenAI API, LangChain, LlamaIndex, AI agents, prompt engineering, natural language processing, computer vision.", category: "AI & Machine Learning", level: "Beginner" },
    { name: "Data Science & Big Data", icon: <Analytics sx={{ color: "#0050FF" }} />, detail: "Data analysis, visualization, business intelligence, big data processing, decision-support systems.", category: "AI & Machine Learning", level: "Beginner" },
    { name: "Cybersecurity", icon: <Security sx={{ color: "#0050FF" }} />, detail: "Security auditing, vulnerability assessment, secure coding, authentication & authorization, DevSecOps.", category: "Security & Systems", level: "Beginner" },
    { name: "Linux & Networking", icon: <SiLinux />, detail: "Linux server administration, shell scripting, network configuration, monitoring with Zabbix, Prometheus & Grafana.", category: "Security & Systems", level: "Intermediate" },
    { name: "IoT & Connected Systems", icon: <Sensors sx={{ color: "#0050FF" }} />, detail: "Internet of Things, embedded systems, sensors & actuators, Arduino, real-time data acquisition, connected devices.", category: "IoT & Embedded", level: "Intermediate" },
    { name: "GIS & Geospatial Apps", icon: <Map sx={{ color: "#0050FF" }} />, detail: "Geographic information systems, spatial data, mapping, geolocation, PostGIS, interactive maps and visualizations.", category: "Specialized Development", level: "Beginner" },
  ];

  const groupProjects = [
    { name: "C++ with Arduino - Smart Bin", icon: <Sensors sx={{ fontSize: 40 }} />, shortDesc: "Smart bin that automatically opens using an ultrasonic sensor.", category: "IoT / Embedded", technologies: ["C++", "Arduino", "Ultrasonic Sensor", "Servo Motor"], fullDetail: "Student group project: Development of a smart bin prototype. The ultrasonic sensor detects user presence and automatically opens the lid. The system includes fill-level monitoring, servo motor control, and LED indicators for waste level status." },
    { name: "Fianara Smart City", icon: <Psychology sx={{ fontSize: 40 }} />, shortDesc: "Innovative smart city solution developed during a Hackathon.", category: "Hackathon", technologies: ["Next.js", "NestJS", "Tailwind CSS"], fullDetail: "During a 48-hour hackathon, our team designed an integrated smart city solution using Next.js for the frontend, NestJS for the backend API, and Tailwind CSS for styling. Features include real-time traffic management, smart parking, waste collection optimization, and public lighting control with data visualization dashboards." },
    { name: "UrbanFlow IA", icon: <Sensors sx={{ fontSize: 40 }} />, shortDesc: "AI-powered urban traffic & mobility management built during a Hackathon.", category: "Hackathon", technologies: ["React", "Node.js", "Python", "AI"], fullDetail: "UrbanFlow IA is an intelligent urban mobility platform developed during a hackathon. It combines a React dashboard, a Node.js backend and a Python AI microservice to analyze traffic in real time, predict congestion, and optimize traffic-light control and route planning for smarter, smoother cities." },
    { name: "AraFashion - E-commerce Design", icon: <DesignServices sx={{ fontSize: 40 }} />, shortDesc: "UI/UX design of a fashion e-commerce application.", category: "UI/UX Design", technologies: ["Figma", "Prototyping", "Design System"], fullDetail: "A collaborative UI/UX project where we designed a complete fashion e-commerce app from scratch. We created user personas, user journeys, wireframes, high-fidelity mockups, and an interactive prototype. The design system includes color palette, typography, components, and responsive layouts for mobile and desktop." },
  ];

  const competences: Competence[] = [
    { name: "PHP / Laravel", value: 85, icon: <FaLaravel />, detail: "MVC architecture, Eloquent ORM, artisan commands, middleware, authentication, RESTful API development.", category: "Backend" },
    { name: "React.js", value: 88, icon: <FaReact />, detail: "Hooks, Context API, Redux, Router, performance optimization, component lifecycle, custom hooks.", category: "Frontend" },
    { name: "Vue.js", value: 82, icon: <FaVuejs />, detail: "Composition API, Vuex/Pinia, Vue Router, reactivity system, component architecture, directives.", category: "Frontend" },
    { name: "Tailwind CSS", value: 90, icon: <SiTailwindcss />, detail: "Utility-first CSS, responsive design, custom configurations, animations, dark mode implementation.", category: "Frontend" },
    { name: "Node.js / Express", value: 84, icon: <FaNodeJs />, detail: "Event-driven architecture, REST APIs, JWT authentication, WebSocket, clustering, middleware.", category: "Backend" },
    { name: "SQL Databases", value: 86, icon: <Storage />, detail: "MySQL, PostgreSQL, complex queries, optimization, indexing, transactions, database design, migrations.", category: "Database" },
    { name: "JavaScript / TypeScript", value: 87, icon: <FaJs />, detail: "ES6+, async/await, closures, promises, type safety, interfaces, generics, advanced types.", category: "Frontend" },
    { name: "HTML5 / CSS3", value: 90, icon: <FaHtml5 />, detail: "Semantic HTML, Flexbox, Grid, animations, responsive design, cross-browser compatibility.", category: "Frontend" },
    { name: "Git & GitHub", value: 88, icon: <Code />, detail: "Version control, branching strategies, CI/CD pipelines, collaborative workflows, code review.", category: "Tools" },
    { name: "Next.js", value: 75, icon: <SiNextdotjs />, detail: "SSR/SSG, API routes, image optimization, file-based routing, middleware, server actions.", category: "Frontend" },
    { name: "NestJS", value: 70, icon: <SiNestjs />, detail: "Modular architecture, Dependency Injection, Guards, Interceptors, Pipes, Microservices.", category: "Backend" },
    { name: "RESTful API Design", value: 85, icon: <Api />, detail: "Resource naming, HTTP methods, status codes, authentication, versioning, documentation.", category: "Backend" },
  ];

  const projects: Project[] = [
    { title: "UltimateChild", category: "Website", description: "Ultimate Child Education Center - A one-page showcase website for an educational center combining playful design with interactive user experience.", images: ["/CentreEducation_1.png", "/CentreEducation_2.png", "/CentreEducation_3.png", "/CentreEducation_4.png", "/CentreEducation_5.png"], tags: ["HTML5", "CSS3", "JavaScript"], github: "https://github.com/Lucia-RASOANIRINA/site_education", demo: "https://helpful-mermaid-acb3d1.netlify.app" },
    { title: "OuraTable", category: "Web Platform", description: "OURATABLE is a recipe-sharing social network where users can publish recipes, engage with the community, participate in AI-generated cooking challenges, and vote for the weekly recipe. Features include private messaging, discussion groups, likes system, and full admin dashboard with user management, and announcements. The Art of Good Eating — Culinary community platform built with Laravel 9.", images: ["/ouratable_1.png", "/ouratable_2.png", "/ouratable_3.png", "/ouratable_4.png"], tags: ["Laravel", "MySQL", "Vue.js"], github: "https://github.com/Lucia-RASOANIRINA/OuraTable", demo: "https://ouratable.onrender.com/" },
    { title: "Garage Pro", category: "Web App", description: "Comprehensive web application for automotive garage operations management.", images: ["/garageJSlocalStorage_1.png", "/garageJSlocalStorage_2.png", "/garageJSlocalStorage_3.png", "/garageJSlocalStorage_4.png"], tags: ["HTML5", "CSS3", "JavaScript"], github: "https://lucia-rasoanirina.github.io/GarageJsLocalStorage/login.html", demo: "https://lucia-rasoanirina.github.io/GarageJsLocalStorage/login.html" },
    { title: "Packet Love Destiny", category: "Mini Game", description: "Interactive mini game developed with Python Tkinter.", images: ["/PokectLoveDestiny.png"], tags: ["Python", "Tkinter", "tkcalendar"], github: "https://github.com/Lucia-RASOANIRINA/Pocket-_Love-_Destiny", demo: "#" },
    { title: "Parent'Lien", category: "Web Platform", description: "Parent'Lien is a collaborative parenting platform connecting parents, educators and psychologists. It offers a social feed, events, shared resources and real-time discussions powered by WebSocket (STOMP/SockJS), built with Vue 3.", images: ["/parentia_1.png", "/parentia_2.png", "/parentia_3.png", "/parentia_4.png", "/parentia_5.png"], tags: ["Vue 3", "Vite", "WebSocket", "Axios"], github: "#", demo: "#" },
    { title: "Portfolio", category: "Creative", description: "Interactive 3D portfolio website built with Three.js, featuring animated 3D models, smooth transitions, and an immersive user experience with parallax effects.", images: ["/portfolio_1.png", "/portfolio_2.png", "/portfolio_3.png", "/portfolio_4.png"], tags: ["Three.js", "React", "WebGL", "3D"], github: "https://github.com/Lucia-RASOANIRINA/MonPortfolio", demo: "https://lucia-rasoanirina-portfolio.netlify.app/" },
    { title: "FeedbackPro", category: "Mobile App", description: "Completely anonymous mobile feedback application for honest communication.", images: ["/feedbackPro_1.jpg", "/feedbackPro_2.jpg", "/feedbackPro_3.jpg", "/feedbackPro_4.jpg", "/feedbackPro_5.jpg"], tags: ["React Native", "Firebase", "Anonymous"], github: "https://github.com/Lucia-RASOANIRINA/FeedBackPro", demo: "https://lucia-rasoanirina.github.io/FeedBackPro/#/" },
  ];

  const openProjectModal = (images: string[], idx: number = 0) => { setModalImages(images); setModalCurrentIndex(idx); setModalOpen(true); };
  const handleNextImage = () => setModalCurrentIndex((p) => (p + 1) % modalImages.length);
  const handlePrevImage = () => setModalCurrentIndex((p) => (p - 1 + modalImages.length) % modalImages.length);

  const groupedCompetences = competences.reduce((acc, comp) => {
    if (!acc[comp.category]) acc[comp.category] = [];
    acc[comp.category].push(comp);
    return acc;
  }, {} as Record<string, Competence[]>);

  const skillCategories = ["Toutes", ...Object.keys(groupedCompetences)];
  const visibleSkillCategories =
    activeSkillCategory === "Toutes" ? Object.entries(groupedCompetences) : Object.entries(groupedCompetences).filter(([cat]) => cat === activeSkillCategory);

  const categoryIcons: Record<string, React.JSX.Element> = {
    Frontend: <Web sx={{ color: "#0050FF", fontSize: 28 }} />,
    Backend: <Storage sx={{ color: "#0050FF", fontSize: 28 }} />,
    Database: <DataObject sx={{ color: "#0050FF", fontSize: 28 }} />,
    Tools: <Build sx={{ color: "#0050FF", fontSize: 28 }} />,
  };

  const groupedAcademicKnowledge = academicKnowledge.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof academicKnowledge>);

  const knowledgeCategoryIcons: Record<string, React.JSX.Element> = {
    "Web Fundamentals": <Language sx={{ color: "#0050FF" }} />,
    Styling: <Brush sx={{ color: "#0050FF" }} />,
    "Frontend Framework": <Web sx={{ color: "#0050FF" }} />,
    "Languages & Tools": <Terminal sx={{ color: "#0050FF" }} />,
    Backend: <Storage sx={{ color: "#0050FF" }} />,
    "Programming Languages": <Code sx={{ color: "#0050FF" }} />,
    Database: <DataObject sx={{ color: "#0050FF" }} />,
    "Mobile Development": <PhoneAndroid sx={{ color: "#0050FF" }} />,
    "Backend as a Service": <Cloud sx={{ color: "#0050FF" }} />,
    "Deployment & Hosting": <Analytics sx={{ color: "#0050FF" }} />,
    "Design Tools": <Brush sx={{ color: "#0050FF" }} />,
    "UI Libraries": <Api sx={{ color: "#0050FF" }} />,
    "State Management": <Code sx={{ color: "#0050FF" }} />,
    "Software Architecture": <Hub sx={{ color: "#0050FF" }} />,
    "DevOps & Cloud": <Cloud sx={{ color: "#0050FF" }} />,
    "AI & Machine Learning": <Psychology sx={{ color: "#0050FF" }} />,
    "Security & Systems": <Security sx={{ color: "#0050FF" }} />,
    "IoT & Embedded": <Sensors sx={{ color: "#0050FF" }} />,
    "Specialized Development": <Map sx={{ color: "#0050FF" }} />,
  };

  const allCategories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => set.add(p.category));
    return ["Tous", ...Array.from(set)];
  }, []);
  const filteredProjects = activeCategory === "Tous" ? projects : projects.filter((p) => p.category === activeCategory);

  const starsRef = useRef(
    [...Array(36)].map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: 0.6 + Math.random() * 1.3,
      dur: 9 + Math.random() * 12,
      delay: Math.random() * 10,
      dx: (Math.random() * 2 - 1) * 90,
      dy: (Math.random() * 2 - 1) * 90,
    }))
  );
  const stars = starsRef.current;

  return (
    <Box minHeight="100vh" bgcolor="#ffffff" position="relative" sx={{ overflowX: "hidden", fontFamily: FONT_BODY }}>
      <PageLoader visible={pageLoading} />
      <ReadingProgressBar />
      <SideNavDots items={menuItems} activeSection={activeSection} onSelect={scrollToSection} />

      <Box sx={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0,
        "& .star": { position: "absolute", color: "#0a0a2e", fontFamily: "serif", willChange: "transform, opacity" } }}>
        {stars.map((s, i) => (
          <Box
            key={`star-${i}`}
            className="star"
            style={{ ["--dx" as string]: `${s.dx}px`, ["--dy" as string]: `${s.dy}px` } as React.CSSProperties}
            sx={{ top: `${s.top}%`, left: `${s.left}%`, fontSize: `${s.size}rem`, animation: `starFloat ${s.dur}s ease-in-out ${s.delay}s infinite` }}
          >
            *
          </Box>
        ))}
      </Box>

      {/* Header — plus transparent en haut, opaque au scroll */}
      <Box
        component="header"
        position="fixed"
        top={0}
        left={0}
        width="100%"
        height={`${HEADER_HEIGHT}px`}
        sx={{
          bgcolor: scrolled ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.55)",
          backdropFilter: scrolled ? "blur(12px)" : "blur(4px)",
          zIndex: 100,
          boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.05)" : "none",
          borderBottom: scrolled ? "1px solid rgba(0,80,255,0.2)" : "1px solid transparent",
          display: "flex",
          alignItems: "center",
          transition: "all 0.35s cubic-bezier(0.2,0.9,0.3,1.1)",
        }}
      >
        <Container maxWidth="lg" sx={{ height: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", px: { xs: 2, sm: 3, md: 4 } }}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flexShrink: 0 }}>
            <Box sx={{ width: { xs: 32, sm: 36 }, height: { xs: 32, sm: 36 }, bgcolor: "#0050FF", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: { xs: 16, sm: 20 }, color: "#fff", fontFamily: FONT_HEADING, boxShadow: "0 4px 12px rgba(0,80,255,0.3)", transition: "transform 0.3s ease", "&:hover": { transform: "rotate(5deg) scale(1.05)" } }}>
              LR
            </Box>
            <Typography fontWeight={800} fontSize={{ xs: 12, sm: 16, md: 18 }} color="#000" fontFamily={FONT_HEADING} noWrap>
              Lucia Rasoanirina
              <Box component="span" fontWeight={400} color="#666" ml={1} sx={{ display: { xs: "none", sm: "inline" } }}>
                / {t.role}
              </Box>
            </Typography>
          </Stack>

          <Stack direction="row" spacing={{ md: 1.5, lg: 3 }} sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
            {menuItems.map((item) => (
              <Stack
                key={item.id}
                direction="row"
                spacing={0.8}
                alignItems="center"
                onClick={() => scrollToSection(item.id)}
                sx={{
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)",
                  color: activeSection === item.id ? "#0050FF" : "#111",
                  transform: activeSection === item.id ? "translateY(-2px)" : "none",
                  "&:hover": { color: "#0050FF", transform: "translateY(-3px)", "& .menu-icon": { transform: "scale(1.2) rotate(360deg)", opacity: 1 } },
                  px: 0.5,
                  py: 1,
                }}
              >
                <Box className="menu-icon" sx={{ fontSize: 16, opacity: 0.7, transition: "all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)" }}>
                  {item.icon}
                </Box>
                <Typography fontSize={{ md: 11, lg: 12 }} fontWeight={600} sx={{ letterSpacing: "0.12em", fontFamily: FONT_MONO, whiteSpace: "nowrap" }}>
                  {item.label}
                  {activeSection === item.id && " {}"}
                </Typography>
              </Stack>
            ))}
          </Stack>

          <IconButton sx={{ display: { xs: "flex", md: "none" }, p: 1, borderRadius: 2, transition: "all 0.3s ease", touchAction: "manipulation", "&:hover": { bgcolor: "rgba(0,80,255,0.08)" } }} onClick={() => { vibrate(12); setOpenMenu(true); }} size="small">
            <Menu sx={{ fontSize: { xs: 24, sm: 28 } }} />
          </IconButton>
        </Container>
      </Box>

      <Drawer
        anchor="right"
        open={openMenu}
        onClose={() => setOpenMenu(false)}
        sx={{ "& .MuiDrawer-paper": { width: { xs: "100%", sm: 320 }, bgcolor: "#F9F7F5", p: 3, boxSizing: "border-box" } }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography fontWeight={700} fontSize={20} color="#000" fontFamily={FONT_HEADING}>Menu</Typography>
          <IconButton onClick={() => setOpenMenu(false)} sx={{ transition: "transform 0.3s ease", "&:hover": { transform: "rotate(90deg)" } }}>
            <Close />
          </IconButton>
        </Stack>
        <List sx={{ p: 0 }}>
          {menuItems.map((item) => {
            const active = activeSection === item.id;
            return (
              <ListItem key={item.id} disablePadding sx={{ mb: 1.5 }}>
                <ListItemButton
                  onClick={() => scrollToSection(item.id)}
                  sx={{
                    borderRadius: 2, transition: "all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)",
                    bgcolor: active ? "rgba(0,80,255,0.12)" : "transparent",
                    borderLeft: active ? "4px solid #0050FF" : "4px solid transparent",
                    py: 2, px: 2,
                    "&:hover": { bgcolor: "rgba(0,80,255,0.08)", transform: "translateX(8px)" },
                  }}
                >
                  <Box sx={{ minWidth: 44, color: active ? "#0050FF" : "#666" }}>{item.icon}</Box>
                  <ListItemText primary={active ? `${item.label} {}` : item.label} primaryTypographyProps={{ fontSize: 15, fontWeight: active ? 800 : 500, letterSpacing: "0.12em", color: active ? "#0050FF" : "#000", fontFamily: FONT_MONO }} />
                  {active && <Box sx={{ width: 8, height: 8, bgcolor: "#0050FF", borderRadius: "50%", ml: 1 }} />}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>

      <Box
        minHeight={`calc(100vh - ${HEADER_HEIGHT}px)`}
        pt={`${HEADER_HEIGHT}px`}
        pb={{ xs: "64px", md: 0 }}
        display="flex"
        alignItems="center"
        position="relative"
        onTouchStart={handleSectionTouchStart}
        onTouchEnd={handleSectionTouchEnd}
      >
        <Box sx={{ position: "absolute", left: 0, top: 0, width: { md: "45%", lg: "40%" }, height: "100%", bgcolor: "#E6DED5", zIndex: 0, display: { xs: "none", md: "block" }, borderRadius: "0 60px 60px 0", opacity: 0.7 }} />
        <Container maxWidth={false} sx={{ position: "relative", zIndex: 1, px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>

          {/* ABOUT */}
          <Stack
            id="about"
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 6, md: 12 }}
            alignItems="center"
            minHeight={isMobile && orientation === "landscape" ? "auto" : `calc(100vh - ${HEADER_HEIGHT}px)`}
            py={isMobile && orientation === "landscape" ? 6 : 0}
          >
            <Zoom in={true} timeout={800}>
              <Box className="profile-card" sx={{ position: "relative", width: { xs: "100%", sm: 450 }, bgcolor: "rgba(244,240,237,0.7)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.6)", boxShadow: "20px 20px 40px rgba(0,0,0,0.1), -10px -10px 20px rgba(255,255,255,0.7)", textAlign: "center", pb: 2, borderRadius: "32px", transition: "all 0.4s", transformStyle: "preserve-3d", "&:hover": { transform: "translateY(-12px) rotateX(3deg) rotateY(3deg)", boxShadow: "30px 30px 50px rgba(0,0,0,0.15)" } }}>
                <Box sx={{ position: "absolute", top: 20, right: 20, display: "flex", alignItems: "center", gap: 1.5, zIndex: 2 }}>
                  <Box sx={{ position: "relative", width: 10, height: 10 }}><Box sx={{ width: 10, height: 10, bgcolor: "#22c55e", borderRadius: "50%", animation: "pulseGreen 1.8s infinite" }} /><Box sx={{ position: "absolute", inset: -4, borderRadius: "50%", background: "rgba(34,197,94,0.4)", animation: "ripple 1.8s infinite" }} /></Box>
                  <Typography sx={{ fontSize: 10, fontFamily: FONT_MONO, letterSpacing: "0.15em", color: "#222", fontWeight: 600 }}>{t.openToWork}</Typography>
                </Box>
                <Box sx={{ p: 4, position: "relative" }}>
                  {/* Effet de particules/lumière autour de la photo */}
                  <Box sx={{ position: "relative", display: "inline-block", transformStyle: "preserve-3d", perspective: "600px" }}>
                    <Box sx={{ position: "absolute", inset: -16, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,80,255,0.25), transparent 70%)", animation: "haloGlow 3.5s ease-in-out infinite", zIndex: 0 }} />
                    {[...Array(8)].map((_, i) => (
                      <Box
                        key={i}
                        sx={{
                          position: "absolute",
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          bgcolor: "#0050FF",
                          top: "50%",
                          left: "50%",
                          zIndex: 1,
                          animation: `particleOrbit 6s linear infinite`,
                          animationDelay: `${i * 0.75}s`,
                          transformOrigin: "0 0",
                          opacity: 0.7,
                        }}
                      />
                    ))}
                    <Avatar src="/photo-lucia.jpg" imgProps={{ loading: "lazy", decoding: "async" }} sx={{ width: { xs: 160, sm: 220 }, height: { xs: 160, sm: 220 }, border: "4px solid #fff", boxShadow: "0 20px 30px rgba(0,0,0,0.2)", position: "relative", zIndex: 2, transition: "transform 0.5s", "&:hover": { transform: "scale(1.03) rotate(-2deg)" } }} />
                    <Box className="badge" sx={{ position: "absolute", bottom: 10, right: -5, width: 52, height: 28, bgcolor: "#0050FF", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_MONO, color: "#fff", fontWeight: 800, fontSize: 12, boxShadow: "0 8px 18px rgba(0,80,255,0.45)", transformStyle: "preserve-3d", animation: "badge3d 3.6s ease-in-out infinite", zIndex: 3 }}>{"< />"}</Box>
                  </Box>
                  <Typography variant="h5" fontWeight={800} fontFamily={FONT_HEADING} sx={{ mt: 3, color: "#000" }}>Lucia Rasoanirina</Typography>
                  <Box sx={{ width: 60, height: 3, bgcolor: "#0050FF", mx: "auto", my: 2, borderRadius: 2 }} />
                  {/* Typing effect */}
                  <Typography fontSize={14} letterSpacing={2} fontWeight={500} color="#444" fontFamily={FONT_MONO} sx={{ minHeight: 20 }}>
                    <TypingText text="FULLSTACK DEVELOPER" />
                  </Typography>
                </Box>
                <Box bgcolor="rgba(255,255,255,0.8)" py={1.5} sx={{ borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}>
                  <Stack direction="row" justifyContent="center" spacing={2}>
                    <IconButton size="small" href="https://web.facebook.com/mariallucia.lucia.35?locale=fr_FR" target="_blank" sx={{ color: "#555", transition: "all 0.3s", "&:hover": { color: "#0050FF", transform: "translateY(-5px) scale(1.2)" } }}><Facebook /></IconButton>
                    <IconButton size="small" href="https://www.linkedin.com/in/lucia-rasoanirina/" target="_blank" sx={{ color: "#555", transition: "all 0.3s", "&:hover": { color: "#0050FF", transform: "translateY(-5px) scale(1.2)" } }}><LinkedIn /></IconButton>
                    <IconButton size="small" href="mailto:luciarasoanirina8@gmail.com" target="_blank" sx={{ color: "#555", transition: "all 0.3s", "&:hover": { color: "#0050FF", transform: "translateY(-5px) scale(1.2)" } }}><MailOutline /></IconButton>
                    <IconButton size="small" href="https://wa.me/2613870236" target="_blank" sx={{ color: "#555", transition: "all 0.3s", "&:hover": { color: "#0050FF", transform: "translateY(-5px) scale(1.2)" } }}><WhatsApp /></IconButton>
                  </Stack>
                </Box>
              </Box>
            </Zoom>

            <Zoom in={true} timeout={800} style={{ transitionDelay: "200ms" }}>
              <Box flex={1} textAlign={{ xs: "center", md: "left" }}>
                <Fade in timeout={800}>
                  <Stack direction="row" alignItems="center" spacing={2} mb={2} justifyContent={{ xs: "center", md: "flex-start" }}>
                    <Typography variant="h1" fontFamily={FONT_HEADING} sx={{ fontSize: "clamp(2.6rem, 9vw, 6.25rem)", fontWeight: 800, lineHeight: 1, background: "linear-gradient(135deg, #000 0%, #0050FF 60%, #00bfff 100%)", backgroundSize: "200% auto", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent", animation: "gradientShift 5s ease infinite" }}>{t.hello}</Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center"><Box sx={{ width: { xs: 24, sm: 34 }, height: { xs: 24, sm: 34 }, borderLeft: "5px solid #0050FF", transform: "rotate(45deg)", animation: "spinSlow 6s linear infinite" }} /><Typography sx={{ fontSize: { xs: 35, sm: 45, md: 60 }, fontWeight: 700, color: "#0050FF" }}>*</Typography></Stack>
                  </Stack>
                </Fade>
                <Typography variant="h5" fontWeight={600} sx={{ mb: 3, color: "#0050FF", fontFamily: FONT_MONO, fontSize: { xs: "0.9rem", sm: "1.1rem" } }}>{t.whoami}</Typography>
                <Stack direction="row" spacing={2} justifyContent={{ xs: "center", md: "flex-start" }} sx={{ mb: 5 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={() => setOpenCv(true)}
                    sx={{ color: "#000", borderColor: "#000", borderRadius: 60, px: { xs: 4, sm: 6 }, py: { xs: 1, sm: 1.5 }, fontWeight: 700, textTransform: "none", transition: "all 0.3s", "&:hover": { borderColor: "#0050FF", color: "#0050FF", transform: "translateY(-4px) scale(1.02)", boxShadow: "0 10px 25px rgba(0,80,255,0.3)", bgcolor: "rgba(0,80,255,0.02)" } }}
                  >
                    {t.downloadCv}
                  </Button>
                </Stack>
                <Typography sx={{ maxWidth: { xs: "100%", md: 850 }, lineHeight: 1.9, fontSize: { xs: 14, sm: 16 }, color: "#333", fontFamily: FONT_BODY, borderLeft: { md: "3px solid #0050FF" }, pl: { md: 3 } }}>{fullText}</Typography>

                {/* Statistiques animées */}
                <Stack direction="row" spacing={{ xs: 4, sm: 6 }} justifyContent={{ xs: "center", md: "flex-start" }} sx={{ mt: 5 }}>
                  <Box textAlign="center">
                    <AnimatedCounter value={3} suffix="+" />
                    <Typography fontSize={12} color="#666" fontFamily={FONT_MONO} sx={{ mt: 0.5 }}>{t.yearsExp}</Typography>
                  </Box>
                  <Box textAlign="center">
                    <AnimatedCounter value={projects.length} suffix="+" />
                    <Typography fontSize={12} color="#666" fontFamily={FONT_MONO} sx={{ mt: 0.5 }}>{t.projectsDone}</Typography>
                  </Box>
                  <Box textAlign="center">
                    <AnimatedCounter value={academicKnowledge.length} suffix="+" />
                    <Typography fontSize={12} color="#666" fontFamily={FONT_MONO} sx={{ mt: 0.5 }}>{t.techMastered}</Typography>
                  </Box>
                </Stack>
              </Box>
            </Zoom>
          </Stack>

          {/* KNOWLEDGE */}
          <Box id="connaissances" sx={{ mt: 12, mb: 10 }}>
            <Reveal3D>
              <Typography variant="h4" fontWeight={800} fontFamily={FONT_HEADING} sx={{ mb: 2, textAlign: "center", color: "#000", fontSize: "clamp(1.5rem, 4vw, 2.125rem)" }}>
                <School sx={{ verticalAlign: "middle", mr: 1, color: "#0050FF", fontSize: 36 }} />
                {t.knowledgeTitle}
              </Typography>
            </Reveal3D>
            <Fade in timeout={800} style={{ transitionDelay: "200ms" }}>
              <Typography variant="subtitle1" sx={{ textAlign: "center", mb: 5, color: "#666", maxWidth: 700, mx: "auto" }}>{t.knowledgeSubtitle}</Typography>
            </Fade>

            {Object.entries(groupedAcademicKnowledge).map(([category, items], catIdx) => (
              <Box key={category} sx={{ mb: 6 }}>
                <Reveal variant="fade-up" delay={catIdx * 50}>
                  <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 4 }}>
                    <Divider sx={{ flex: 1, bgcolor: "rgba(0,80,255,0.2)" }} />
                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ bgcolor: "rgba(0,80,255,0.05)", px: 3, py: 1, borderRadius: 50, border: "1px solid rgba(0,80,255,0.2)" }}>
                      {knowledgeCategoryIcons[category]}
                      <Typography variant="h5" fontWeight={700} fontFamily={FONT_HEADING} color="#0050FF" letterSpacing={1}>{category}</Typography>
                    </Stack>
                    <Divider sx={{ flex: 1, bgcolor: "rgba(0,80,255,0.2)" }} />
                  </Stack>
                </Reveal>
                <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 3, width: "100%" }}>
                  {items.map((item, idx) => {
                    const isOpen = openConnaissanceDetail === item.name;
                    const shortDetail = item.detail.length > 80 ? item.detail.substring(0, 80) + "..." : item.detail;
                    return (
                      <Zoom in={true} timeout={400} style={{ transitionDelay: `${idx * 100}ms` }} key={idx}>
                        <Box
                          sx={{
                            bgcolor: "rgba(244,240,237,0.75)",
                            backdropFilter: "blur(8px)",
                            border: "1px solid rgba(255,255,255,0.6)",
                            p: 3,
                            borderRadius: 3,
                            transition: "all 0.35s cubic-bezier(0.2, 0.9, 0.4, 1.1)",
                            width: { xs: "100%", sm: "calc(50% - 24px)", md: "calc(33.333% - 24px)", lg: "calc(25% - 24px)" },
                            minWidth: { xs: "100%", sm: "280px", md: "260px" },
                            flexGrow: 0,
                            transformStyle: "preserve-3d",
                            "&:hover": { transform: "translateY(-6px) rotateX(3deg)", boxShadow: "0 12px 26px rgba(0,0,0,0.12)" },
                            display: "flex",
                            flexDirection: "column",
                            height: "auto",
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                            <Box sx={{ fontSize: 32, color: "#0050FF" }}>{item.icon}</Box>
                            <Typography fontWeight={700} fontSize={16} fontFamily={FONT_HEADING} color="#000">{item.name}</Typography>
                          </Stack>
                          <Chip label={item.level} size="small" sx={{ bgcolor: "#0050FF15", color: "#0050FF", fontSize: 10, height: 24, width: "fit-content", mb: 1.5, fontWeight: 600, borderRadius: 2 }} />
                          <Typography fontSize={12} color="#555" lineHeight={1.5} sx={{ mb: 1 }}>{isOpen ? item.detail : shortDetail}</Typography>
                          {item.detail.length > 80 && (
                            <Button
                              size="small"
                              onClick={() => setOpenConnaissanceDetail(isOpen ? null : item.name)}
                              sx={{ color: "#0050FF", textTransform: "none", p: 0, minWidth: "auto", fontSize: "0.75rem", fontWeight: 500, alignSelf: "flex-start", transition: "all 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1)", "&:hover": { bgcolor: "transparent", color: "#003bb5", transform: "translateX(2px)" } }}
                            >
                              <InfoOutlined sx={{ fontSize: 14, mr: 0.5, transition: "transform 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1)" }} />
                              {isOpen ? t.showLess : t.moreInfo}
                            </Button>
                          )}
                        </Box>
                      </Zoom>
                    );
                  })}
                </Box>
              </Box>
            ))}

            <Box sx={{ mt: 8 }}>
              <Reveal variant="fade-up">
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 4 }}>
                  <Divider sx={{ flex: 1, bgcolor: "rgba(0,80,255,0.2)" }} />
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ bgcolor: "rgba(0,80,255,0.05)", px: 3, py: 1, borderRadius: 50, border: "1px solid rgba(0,80,255,0.2)" }}>
                    <Group sx={{ color: "#0050FF", fontSize: 28 }} />
                    <Typography variant="h5" fontWeight={700} fontFamily={FONT_HEADING} color="#0050FF" letterSpacing={1}>{t.groupProjects}</Typography>
                  </Stack>
                  <Divider sx={{ flex: 1, bgcolor: "rgba(0,80,255,0.2)" }} />
                </Stack>
              </Reveal>
              <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 3, width: "100%" }}>
                {groupProjects.map((item, idx) => {
                  const isGroupOpen = openSkillDetail === item.name;
                  const shortDesc = item.shortDesc.length > 60 ? item.shortDesc.substring(0, 60) + "..." : item.shortDesc;
                  return (
                    <Zoom in={true} timeout={400} style={{ transitionDelay: `${idx * 150}ms` }} key={idx}>
                      <Box sx={{ width: { xs: "100%", sm: "calc(50% - 24px)", md: "calc(33.333% - 24px)" }, minWidth: { xs: "100%", sm: "300px" }, flexGrow: 0 }}>
                        <GlowCard>
                          <Box sx={{ bgcolor: "rgba(244,240,237,0.8)", borderRadius: 4, overflow: "hidden", transition: "all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)", height: "100%", "&:hover": { transform: "translateY(-6px)", boxShadow: "0 12px 28px rgba(0,0,0,0.12)" } }}>
                            <Box sx={{ bgcolor: "#0050FF", px: 2.5, py: 1.5 }}>
                              <Stack direction="row" alignItems="center" spacing={1.5}>
                                <Box sx={{ color: "#fff", display: "flex", alignItems: "center" }}>{item.icon}</Box>
                                <Typography variant="subtitle1" fontWeight={700} fontFamily={FONT_HEADING} color="#fff">{item.name}</Typography>
                              </Stack>
                            </Box>
                            <Box sx={{ p: 2.5 }}>
                              <Chip label={item.category} size="small" sx={{ bgcolor: "rgba(0,80,255,0.1)", color: "#0050FF", fontWeight: 600, mb: 2 }} />
                              <Typography fontSize={13} color="#444" lineHeight={1.5} sx={{ mb: 1.5 }}>{isGroupOpen ? item.fullDetail : shortDesc}</Typography>
                              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, mb: 1.5 }}>
                                {item.technologies.map((tech, i) => (
                                  <Chip key={i} label={tech} size="small" variant="outlined" sx={{ borderColor: "#0050FF", color: "#0050FF", fontSize: 10, height: 22 }} />
                                ))}
                              </Box>
                              {item.fullDetail.length > 60 && (
                                <Button size="small" onClick={() => setOpenSkillDetail(isGroupOpen ? null : item.name)} sx={{ color: "#0050FF", textTransform: "none", p: 0, fontWeight: 500, fontSize: "0.75rem", transition: "all 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1)", "&:hover": { bgcolor: "transparent", color: "#003bb5", transform: "translateX(2px)" } }}>
                                  <InfoOutlined sx={{ fontSize: 14, mr: 0.5, transition: "transform 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1)" }} />
                                  {isGroupOpen ? t.showLess : t.moreInfo}
                                </Button>
                              )}
                            </Box>
                          </Box>
                        </GlowCard>
                      </Box>
                    </Zoom>
                  );
                })}
              </Box>
            </Box>
          </Box>

          {/* SKILLS */}
          <Box id="competences" sx={{ mt: 8, mb: 10 }}>
            <Reveal3D>
              <Typography variant="h4" fontWeight={800} fontFamily={FONT_HEADING} sx={{ mb: 2, textAlign: "center", color: "#000", fontSize: "clamp(1.5rem, 4vw, 2.125rem)" }}>
                <Code sx={{ verticalAlign: "middle", mr: 1, color: "#0050FF", fontSize: 36 }} />
                {t.skillsTitle}
              </Typography>
            </Reveal3D>
            <Fade in timeout={800} style={{ transitionDelay: "200ms" }}>
              <Typography variant="subtitle1" sx={{ textAlign: "center", mb: 4, color: "#666", maxWidth: 700, mx: "auto" }}>{t.skillsSubtitle}</Typography>
            </Fade>

            {/* Filtres par catégorie */}
            <Stack direction="row" spacing={1.2} flexWrap="wrap" justifyContent="center" sx={{ mb: 5, gap: 1 }}>
              {skillCategories.map((cat) => (
                <Chip
                  key={cat}
                  icon={<FilterList sx={{ fontSize: 16 }} />}
                  label={cat}
                  onClick={() => setActiveSkillCategory(cat)}
                  sx={{
                    fontWeight: 600,
                    fontFamily: FONT_MONO,
                    bgcolor: activeSkillCategory === cat ? "#0050FF" : "rgba(0,80,255,0.08)",
                    color: activeSkillCategory === cat ? "#fff" : "#0050FF",
                    transition: "all 0.25s cubic-bezier(0.2,0.9,0.4,1.1)",
                    "&:hover": { bgcolor: activeSkillCategory === cat ? "#003bb5" : "rgba(0,80,255,0.18)" },
                  }}
                />
              ))}
            </Stack>

            {visibleSkillCategories.map(([category, skills]) => (
              <Box key={category} sx={{ mb: 6 }}>
                <Reveal variant="fade-up">
                  <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 4 }}>
                    <Divider sx={{ flex: 1, bgcolor: "rgba(0,80,255,0.2)" }} />
                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ bgcolor: "rgba(0,80,255,0.05)", px: 3, py: 1, borderRadius: 50, border: "1px solid rgba(0,80,255,0.2)" }}>
                      {categoryIcons[category] || <Code sx={{ color: "#0050FF", fontSize: 28 }} />}
                      <Typography variant="h5" fontWeight={700} fontFamily={FONT_HEADING} color="#0050FF" letterSpacing={1}>{category}</Typography>
                    </Stack>
                    <Divider sx={{ flex: 1, bgcolor: "rgba(0,80,255,0.2)" }} />
                  </Stack>
                </Reveal>
                <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 3, width: "100%" }}>
                  {skills.map((skill) => (
                    <Box key={skill.name} sx={{ width: { xs: "100%", sm: "calc(50% - 24px)", lg: "calc(33.333% - 24px)" }, minWidth: { xs: "100%", sm: "300px" }, flexGrow: 0 }}>
                      <SkillCard skill={skill} openSkillDetail={openSkillDetail} setOpenSkillDetail={setOpenSkillDetail} moreLabel={t.moreInfo} lessLabel={t.showLess} />
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>

          {/* PROJECTS */}
          <Box id="projects" sx={{ mt: 8, mb: 10 }}>
            <Reveal3D>
              <Typography variant="h4" fontWeight={800} fontFamily={FONT_HEADING} sx={{ mb: 3, textAlign: "center", color: "#000", fontSize: "clamp(1.5rem, 4vw, 2.125rem)" }}>
                <WorkOutline sx={{ verticalAlign: "middle", mr: 1, color: "#0050FF", fontSize: 36 }} />
                {t.projectsTitle}
              </Typography>
            </Reveal3D>

            {/* Filtre par catégorie (Website, Web App, Mobile App, ...) */}
            <Stack direction="row" spacing={1.2} flexWrap="wrap" justifyContent="center" sx={{ mb: 5, gap: 1 }}>
              {allCategories.map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  onClick={() => {
                    vibrate(10);
                    setActiveCategory(cat);
                  }}
                  sx={{
                    fontWeight: 600,
                    fontFamily: FONT_MONO,
                    bgcolor: activeCategory === cat ? "#0050FF" : "rgba(0,80,255,0.08)",
                    color: activeCategory === cat ? "#fff" : "#0050FF",
                    transition: "all 0.25s cubic-bezier(0.2,0.9,0.4,1.1)",
                    touchAction: "manipulation",
                    "&:hover": { bgcolor: activeCategory === cat ? "#003bb5" : "rgba(0,80,255,0.18)" },
                  }}
                />
              ))}
            </Stack>

            <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 4, width: "100%" }}>
              {filteredProjects.map((project, idx) => {
                const isProjectOpen = openProjectDetail === project.title;
                const isMobileApp = project.category === "Mobile App";
                const shortDescription = project.description.length > 100 ? project.description.substring(0, 100) + "..." : project.description;
                return (
                  <Zoom in={true} timeout={500} style={{ transitionDelay: `${idx * 120}ms` }} key={project.title}>
                    <Box sx={{ width: { xs: "100%", sm: "calc(50% - 32px)", md: "calc(33.333% - 32px)" }, minWidth: { xs: "100%", sm: "320px" }, flexGrow: 0 }}>
                      <GlowCard>
                        <Card
                          className="project-card"
                          sx={{ bgcolor: "#F4F0ED", borderRadius: 5, transition: "all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", transformStyle: "preserve-3d", containerType: "inline-size", containerName: "project-card", "&:hover": { transform: "translateY(-12px) rotateX(2deg) rotateY(2deg)", boxShadow: "0 25px 40px rgba(0,0,0,0.2)", "& .project-media": { transform: "scale(1.08)" } } }}
                        >
                          <Box sx={{ position: "relative", height: 200, overflow: "hidden", bgcolor: isMobileApp ? "#0a0a2e" : "transparent" }}>
                            {isMobileApp && (
                              <Box aria-hidden sx={{ position: "absolute", inset: 0, backgroundImage: `url(${project.images[0]})`, backgroundSize: "cover", backgroundPosition: "center", filter: "blur(20px) brightness(0.5)", transform: "scale(1.25)" }} />
                            )}
                            <CardMedia
                              component="img"
                              image={project.images[0]}
                              className="project-media"
                              loading="lazy"
                              sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                              onClick={() => openProjectModal(project.images, 0)}
                              onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.src = PLACEHOLDER_IMG; }}
                              sx={{ position: "relative", height: "100%", width: "100%", objectFit: isMobileApp ? "contain" : "cover", py: isMobileApp ? 1 : 0, transition: "transform 0.5s cubic-bezier(0.2, 0.9, 0.4, 1.1)", cursor: "pointer" }}
                            />
                            <Box sx={{ position: "absolute", top: 14, right: 14, bgcolor: "#0050FF", px: 1.5, py: 0.6, borderRadius: 5, fontSize: 11, fontWeight: 800, color: "white", zIndex: 2, fontFamily: FONT_MONO }}>{project.category}</Box>
                          </Box>
                          <CardContent sx={{ p: 2.5, flex: 1 }}>
                            <Typography variant="h6" fontWeight={800} fontFamily={FONT_HEADING} color="#000" gutterBottom>{project.title}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: "0.85rem" }}>{isProjectOpen ? project.description : shortDescription}</Typography>
                            <Stack direction="row" flexWrap="wrap" gap={0.8}>
                              {project.tags.slice(0, 3).map((tag) => (
                                <Box key={tag} onClick={(e) => { e.stopPropagation(); vibrate(10); setActiveCategory(project.category); scrollToSection("projects"); }} title={`Voir les projets « ${project.category} »`} sx={{ bgcolor: "rgba(0,80,255,0.1)", px: 1.5, py: 0.5, borderRadius: 20, fontSize: 12, fontWeight: 600, color: "#0050FF", cursor: "pointer", transition: "all 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1)", touchAction: "manipulation", "&:hover": { bgcolor: "#0050FF", color: "#fff", transform: "scale(1.05)" } }}>
                                  {tag}
                                </Box>
                              ))}
                            </Stack>
                            {project.description.length > 100 && (
                              <Button size="small" onClick={() => setOpenProjectDetail(isProjectOpen ? null : project.title)} sx={{ color: "#0050FF", textTransform: "none", p: 0, minWidth: "auto", mt: 1, fontWeight: 500, fontSize: "0.75rem", transition: "all 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1)", "&:hover": { bgcolor: "transparent", color: "#003bb5", transform: "translateX(2px)" } }}>
                                <InfoOutlined sx={{ fontSize: 14, mr: 0.5, transition: "transform 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1)" }} />
                                {isProjectOpen ? t.showLess : t.moreInfo}
                              </Button>
                            )}
                          </CardContent>
                          <CardActions sx={{ px: 2.5, pb: 2.5, gap: 1 }}>
                            <Button size="small" startIcon={<GitHub />} {...(project.github === "#" ? { onClick: handleNoLink } : { href: project.github, target: "_blank" })} sx={{ color: "#333", fontWeight: 600, transition: "all 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1)", "&:hover": { color: "#0050FF", transform: "translateX(3px)" } }}>{t.code}</Button>
                            <Button size="small" startIcon={<Launch />} {...(project.demo === "#" ? { onClick: handleNoLink } : { href: project.demo, target: "_blank" })} sx={{ color: "#0050FF", fontWeight: 600, transition: "all 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1)", "&:hover": { transform: "translateX(3px) scale(1.02)" } }}>{t.demo}</Button>
                          </CardActions>
                        </Card>
                      </GlowCard>
                    </Box>
                  </Zoom>
                );
              })}
            </Box>
          </Box>

          {/* CONTACT */}
          <Box id="contact" sx={{ mt: 6, mb: 10 }}>
            <Reveal3D>
              <Typography variant="h4" fontWeight={800} fontFamily={FONT_HEADING} sx={{ mb: 4, textAlign: "center", color: "#000", fontSize: "clamp(1.5rem, 4vw, 2.125rem)" }}>
                <MailOutline sx={{ verticalAlign: "middle", mr: 1, color: "#0050FF", fontSize: 36 }} />
                {t.contactTitle}
              </Typography>
            </Reveal3D>
            <Grid container spacing={4} sx={{ maxWidth: 1000, mx: "auto" }}>
              <Grid size={{ xs: 12, md: 6 }} display="flex">
                <Zoom in={true} timeout={600} style={{ transitionDelay: "200ms" }}>
                  <Paper sx={{ p: 3, bgcolor: "rgba(244,240,237,0.75)", backdropFilter: "blur(14px)", border: "1px solid rgba(255,255,255,0.5)", borderRadius: 5, width: "100%", display: "flex", flexDirection: "column", transition: "all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)", "&:hover": { transform: "translateY(-10px)", boxShadow: "0 25px 35px rgba(0,0,0,0.15)", border: "1px solid rgba(0,80,255,0.4)" } }}>
                    <Typography variant="h6" fontWeight={800} fontFamily={FONT_HEADING} gutterBottom color="#000">{t.letsWork}</Typography>
                    <Typography variant="body2" sx={{ mb: 3, color: "#444" }}>{t.contactDesc}</Typography>
                    <Stack spacing={2.5} flex={1}>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ transition: "0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1)", "&:hover": { transform: "translateX(6px)", "& svg": { transform: "scale(1.1)", color: "#0050FF" } } }}>
                        <AlternateEmail sx={{ color: "#0050FF", fontSize: 22, transition: "0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)" }} />
                        <Typography variant="body2" color="#111" fontWeight={500}>luciarasoanirina8@gmail.com</Typography>
                      </Stack>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ transition: "0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1)", "&:hover": { transform: "translateX(6px)", "& svg": { transform: "scale(1.1)", color: "#0050FF" } } }}>
                        <Phone sx={{ color: "#0050FF", fontSize: 22, transition: "0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)" }} />
                        <Typography variant="body2" color="#111" fontWeight={500}>+261 38 702 36</Typography>
                      </Stack>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ transition: "0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1)", "&:hover": { transform: "translateX(6px)", "& svg": { transform: "scale(1.1)", color: "#0050FF" } } }}>
                        <LocationOn sx={{ color: "#0050FF", fontSize: 22, transition: "0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)" }} />
                        <Typography variant="body2" color="#111" fontWeight={500}>Fianarantsoa, Madagascar</Typography>
                      </Stack>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ transition: "0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1)", "&:hover": { transform: "translateX(6px)", "& svg": { transform: "scale(1.1)", color: "#0050FF" } } }}>
                        <CheckCircle sx={{ color: "#0050FF", fontSize: 22, transition: "0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)" }} />
                        <Typography variant="body2" color="#111" fontWeight={500}>{t.available}</Typography>
                      </Stack>
                    </Stack>
                  </Paper>
                </Zoom>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} display="flex">
                <Zoom in={true} timeout={600} style={{ transitionDelay: "400ms" }}>
                  <Paper sx={{ p: 3, bgcolor: "#ffffff", borderRadius: 5, border: "1px solid rgba(0,0,0,0.08)", width: "100%", display: "flex", flexDirection: "column", transition: "all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)", "&:hover": { transform: "translateY(-10px)", boxShadow: "0 20px 30px rgba(0,0,0,0.1)", borderColor: "#0050FF" } }}>
                    <form ref={formRef} onSubmit={sendEmail} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                      <Stack spacing={2.5} flex={1}>
                        <TextField fullWidth label={t.fullName} value={formData.name} onChange={handleNameChange} onBlur={handleNameBlur} required size="small" error={touched.name && !!formErrors.name} InputProps={{ endAdornment: touched.name && formErrors.name ? <Tooltip title={formErrors.name} arrow><ErrorOutline color="error" sx={{ fontSize: 20 }} /></Tooltip> : touched.name && !formErrors.name && formData.name ? <CheckCircleOutline color="success" sx={{ fontSize: 20 }} /> : null }} />
                        <TextField fullWidth label={t.emailLabel} value={formData.email} onChange={handleEmailChange} onBlur={handleEmailBlur} type="email" required size="small" error={touched.email && !!formErrors.email} InputProps={{ endAdornment: touched.email && formErrors.email ? <Tooltip title={formErrors.email} arrow><ErrorOutline color="error" sx={{ fontSize: 20 }} /></Tooltip> : touched.email && !formErrors.email && formData.email ? <CheckCircleOutline color="success" sx={{ fontSize: 20 }} /> : null }} />
                        <TextField fullWidth label={t.subjectLabel} value={formData.subject} onChange={handleSubjectChange} onBlur={handleSubjectBlur} required size="small" error={touched.subject && !!formErrors.subject} InputProps={{ endAdornment: touched.subject && formErrors.subject ? <Tooltip title={formErrors.subject} arrow><ErrorOutline color="error" sx={{ fontSize: 20 }} /></Tooltip> : touched.subject && !formErrors.subject && formData.subject ? <CheckCircleOutline color="success" sx={{ fontSize: 20 }} /> : null }} />
                        <TextField fullWidth label={t.messageLabel} value={formData.message} onChange={handleMessageChange} onBlur={handleMessageBlur} multiline rows={3} required error={touched.message && !!formErrors.message} InputProps={{ endAdornment: touched.message && formErrors.message ? <Tooltip title={formErrors.message} arrow><ErrorOutline color="error" sx={{ fontSize: 20 }} /></Tooltip> : touched.message && !formErrors.message && formData.message ? <CheckCircleOutline color="success" sx={{ fontSize: 20 }} /> : null }} />
                        <Button type="submit" variant="contained" startIcon={sending ? <CircularProgress size={20} color="inherit" /> : <Send />} disabled={sending || !isFormValid()} sx={{ bgcolor: "#0050FF", borderRadius: 60, px: 4, py: 1.2, fontWeight: 700, alignSelf: "flex-start", transition: "all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)", "&:hover": { bgcolor: "#003bb5", transform: "translateY(-3px)", boxShadow: "0 8px 18px rgba(0,80,255,0.4)" }, "&.Mui-disabled": { bgcolor: "#ccc" } }}>{sending ? t.sending : t.send}</Button>
                      </Stack>
                    </form>
                  </Paper>
                </Zoom>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: "#0a0a0a",
          color: "#fff",
          mt: { xs: 5, md: 8 },
          pb: { xs: "72px", md: 0 }, // laisse la place à la bottom nav mobile fixe
          borderTop: "1px solid rgba(0,80,255,0.3)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "4px", background: "linear-gradient(90deg, #0050FF, #00bfff, #0050FF)", backgroundSize: "200% 100%", animation: "wave 2s infinite linear" }} />

        <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 5 }, px: { xs: 2.5, sm: 3, md: 4 } }}>
          <Grid container spacing={{ xs: 4, md: 5 }} justifyContent="space-between">
            <Grid size={{ xs: 12, md: 5 }}>
              <Stack spacing={2.2} alignItems={{ xs: "center", md: "flex-start" }} textAlign={{ xs: "center", md: "left" }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box sx={{ width: { xs: 42, sm: 48 }, height: { xs: 42, sm: 48 }, bgcolor: "#0050FF", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: { xs: 18, sm: 22 }, color: "#fff", fontFamily: FONT_HEADING, boxShadow: "0 0 20px rgba(0,80,255,0.5)", transition: "0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)", flexShrink: 0, "&:hover": { transform: "scale(1.05) rotate(5deg)", boxShadow: "0 0 30px rgba(0,80,255,0.8)" } }}>LR</Box>
                  <Typography variant="h5" fontWeight={800} fontFamily={FONT_HEADING} sx={{ letterSpacing: 1, fontSize: { xs: "1.15rem", sm: "1.5rem" }, background: "linear-gradient(135deg, #fff 0%, #0050FF 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>Lucia Rasoanirina</Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: "#ccc", lineHeight: 1.7, maxWidth: { xs: "100%", md: "90%" }, fontSize: { xs: "0.82rem", sm: "0.875rem" } }}>{t.footerDesc}</Typography>
                <Stack direction="row" spacing={{ xs: 1.2, sm: 2 }} flexWrap="wrap" justifyContent="center">
                  <IconButton size="medium" href="https://web.facebook.com/mariallucia.lucia.35?locale=fr_FR" target="_blank" sx={{ color: "#aaa", bgcolor: "rgba(255,255,255,0.05)", transition: "all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)", touchAction: "manipulation", "&:hover": { color: "#0050FF", bgcolor: "rgba(0,80,255,0.2)", transform: "translateY(-5px) scale(1.1)" } }}><Facebook /></IconButton>
                  <IconButton size="medium" href="https://www.linkedin.com/in/lucia-rasoanirina/" target="_blank" sx={{ color: "#aaa", bgcolor: "rgba(255,255,255,0.05)", transition: "all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)", touchAction: "manipulation", "&:hover": { color: "#0050FF", bgcolor: "rgba(0,80,255,0.2)", transform: "translateY(-5px) scale(1.1)" } }}><LinkedIn /></IconButton>
                  <IconButton size="medium" href="https://www.instagram.com/rasoanirinambolatiana" target="_blank" sx={{ color: "#aaa", bgcolor: "rgba(255,255,255,0.05)", transition: "all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)", touchAction: "manipulation", "&:hover": { color: "#0050FF", bgcolor: "rgba(0,80,255,0.2)", transform: "translateY(-5px) scale(1.1)" } }}><Instagram /></IconButton>
                  <IconButton size="medium" href="https://github.com/Lucia-RASOANIRINA" target="_blank" sx={{ color: "#aaa", bgcolor: "rgba(255,255,255,0.05)", transition: "all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)", touchAction: "manipulation", "&:hover": { color: "#0050FF", bgcolor: "rgba(0,80,255,0.2)", transform: "translateY(-5px) scale(1.1)" } }}><GitHub /></IconButton>
                </Stack>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Stack
                direction="row"
                spacing={{ xs: 3, sm: 6, md: 8 }}
                justifyContent={{ xs: "center", sm: "center", md: "flex-end" }}
                textAlign={{ xs: "center", md: "left" }}
                sx={{ flexWrap: "wrap", rowGap: 3 }}
              >
                <Stack spacing={1.5} alignItems={{ xs: "center", md: "flex-start" }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ color: "#0050FF", letterSpacing: 1, fontSize: { xs: "0.78rem", sm: "0.85rem" } }}>{t.navigation}</Typography>
                  {menuItems.slice(0, 2).map((item) => (
                    <Stack key={item.id} direction="row" alignItems="center" spacing={1.5}>
                      <Box sx={{ color: "#aaa", fontSize: 18, display: { xs: "none", sm: "flex" }, transition: "0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)" }}>{item.icon}</Box>
                      <Typography
                        variant="body2"
                        sx={{ color: "#ccc", cursor: "pointer", fontSize: { xs: "0.8rem", sm: "0.875rem" }, touchAction: "manipulation", transition: "0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)", "&:hover": { color: "#0050FF", transform: "translateX(8px)" } }}
                        onClick={() => scrollToSection(item.id)}
                      >
                        {item.label}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
                <Stack spacing={1.5} alignItems={{ xs: "center", md: "flex-start" }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ color: "#0050FF", letterSpacing: 1, fontSize: { xs: "0.78rem", sm: "0.85rem" } }}>{t.explore}</Typography>
                  {menuItems.slice(2, 5).map((item) => (
                    <Stack key={item.id} direction="row" alignItems="center" spacing={1.5}>
                      <Box sx={{ color: "#aaa", fontSize: 18, display: { xs: "none", sm: "flex" }, transition: "0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)" }}>{item.icon}</Box>
                      <Typography
                        variant="body2"
                        sx={{ color: "#ccc", cursor: "pointer", fontSize: { xs: "0.8rem", sm: "0.875rem" }, touchAction: "manipulation", transition: "0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)", "&:hover": { color: "#0050FF", transform: "translateX(8px)" } }}
                        onClick={() => scrollToSection(item.id)}
                      >
                        {item.label}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Grid>
          </Grid>

          <Box
            sx={{
              borderTop: "1px solid rgba(255,255,255,0.1)",
              mt: { xs: 3, sm: 4 },
              pt: { xs: 2.5, sm: 3 },
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              gap: { xs: 1.2, sm: 2 },
              textAlign: "center",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Copyright sx={{ fontSize: 14, color: "#888" }} />
              <Typography variant="body2" sx={{ color: "#888", fontSize: { xs: "0.72rem", sm: "0.875rem" } }}>{t.rights}</Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: "#888", fontSize: { xs: "0.72rem", sm: "0.875rem" } }}>{t.madeIn}</Typography>
          </Box>
        </Container>
      </Box>

      <PullToRefresh onRefresh={handlePullRefresh} />
      <BottomNav items={menuItems} activeSection={activeSection} onSelect={scrollToSection} />
      <ScrollToTop bottomOffset={isMobile ? 76 : 24} />
      <ImageModal open={modalOpen} images={modalImages} currentIndex={modalCurrentIndex} onClose={() => setModalOpen(false)} onNext={handleNextImage} onPrev={handlePrevImage} />

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>{snackbar.message}</Alert>
      </Snackbar>

      {openCv && <CvLivre onClose={() => setOpenCv(false)} />}

      {deployMsg && (
        <Box sx={{ position: "fixed", inset: 0, zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", perspective: "1200px" }}>
          <Box sx={{ pointerEvents: "auto", textAlign: "center", px: { xs: 4, md: 6 }, py: { xs: 3.5, md: 4.5 }, borderRadius: 2, color: "#0a0a2e", bgcolor: "rgba(255,255,255,0.82)", backdropFilter: "blur(16px)", border: "1px solid rgba(0,80,255,0.22)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8), 0 6px 0 rgba(0,80,255,0.14), 0 24px 60px rgba(0,80,255,0.28)", transformStyle: "preserve-3d", animation: "deploy3d 2.6s cubic-bezier(0.2, 0.9, 0.3, 1.2) forwards" }}>
            <Box sx={{ display: "inline-flex", color: "#0050FF", mb: 1.5, transformStyle: "preserve-3d", animation: "iconFloat3d 2.6s ease-in-out infinite" }}>
              <RocketLaunch sx={{ fontSize: { xs: 46, md: 60 } }} />
            </Box>
            <Typography variant="h5" fontWeight={800} fontFamily={FONT_HEADING} sx={{ letterSpacing: 0.5, background: "linear-gradient(135deg, #0a0a2e 0%, #0050FF 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>{t.notDeployed}</Typography>
            <Typography sx={{ mt: 1, color: "#555", fontSize: { xs: "0.82rem", md: "0.92rem" } }}>{t.notDeployedSub}</Typography>
          </Box>
        </Box>
      )}

      <style>{`
        @keyframes deploy3d { 0% { opacity: 0; transform: rotateX(-70deg) translateY(60px) scale(0.7); } 18% { opacity: 1; transform: rotateX(0deg) translateY(0) scale(1); } 82% { opacity: 1; transform: rotateX(0deg) translateY(0) scale(1); } 100% { opacity: 0; transform: rotateX(60deg) translateY(-40px) scale(0.85); } }
        @keyframes iconFloat3d { 0%,100% { transform: rotateY(0deg) rotateX(0deg) translateZ(0) translateY(0); } 25% { transform: rotateY(22deg) rotateX(-8deg) translateZ(14px) translateY(-4px); } 50% { transform: rotateY(0deg) rotateX(10deg) translateZ(8px) translateY(-7px); } 75% { transform: rotateY(-22deg) rotateX(-6deg) translateZ(14px) translateY(-4px); } }
        @keyframes badge3d { 0%,100% { transform: rotateY(0deg) rotateX(0deg) translateZ(0); } 25% { transform: rotateY(24deg) rotateX(-12deg) translateZ(14px); } 50% { transform: rotateY(0deg) rotateX(10deg) translateZ(8px); } 75% { transform: rotateY(-24deg) rotateX(-8deg) translateZ(14px); } }
        @keyframes gradientShift { 0% { background-position: 0% 0%; } 100% { background-position: 200% 0%; } }
        @keyframes spinSlow { 0% { transform: rotate(45deg); } 100% { transform: rotate(405deg); } }
        @keyframes pulseGreen { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.3); opacity: 0.8; } }
        @keyframes ripple { 0% { transform: scale(0.8); opacity: 0.6; } 100% { transform: scale(1.5); opacity: 0; } }
        @keyframes starFloat { 0% { transform: translate(0,0) rotate(0deg) scale(0.85); opacity: 0.12; } 50% { transform: translate(var(--dx, 0px), var(--dy, 0px)) rotate(180deg) scale(1.3); opacity: 0.5; } 100% { transform: translate(0,0) rotate(360deg) scale(0.85); opacity: 0.12; } }
        @keyframes wave { 0% { background-position: 0% 0%; } 100% { background-position: 200% 0%; } }
        @keyframes loaderPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @keyframes loaderBar { 0% { transform: translateX(-100%); } 100% { transform: translateX(350%); } }
        @keyframes caretBlink { 50% { border-color: transparent; } }
        @keyframes haloGlow { 0%,100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 0.9; transform: scale(1.1); } }
        @keyframes particleOrbit {
          0% { transform: rotate(0deg) translateX(90px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: rotate(360deg) translateX(90px) rotate(-360deg); opacity: 0; }
        }
        /* Container queries : la carte projet adapte son titre à sa propre largeur,
           pas à celle de l'écran — utile quand la même carte se retrouve dans une
           grille à 1, 2 ou 3 colonnes. */
        @container project-card (max-width: 260px) {
          .project-card h6 { font-size: 1rem !important; }
        }
      `}</style>
    </Box>
  );
}
