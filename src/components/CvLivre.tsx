// FICHIER: src/components/CvLivre.tsx

import { useEffect, useState, type ReactNode } from "react";
import QRCode from "qrcode";
import {
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
  Grid,
} from "@mui/material";
import {
  Download,
  Email,
  Phone,
  LocationOn,
  Facebook,
  LinkedIn,
  GitHub,
  Instagram,
  CheckCircle,
  Close,
  NavigateNext,
  NavigateBefore,
} from "@mui/icons-material";

interface CvLivreProps {
  onClose?: () => void;
}

function PageHeader({ label }: { label: string }) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 1, sm: 1.2 },
        borderBottom: "1px solid rgba(0,80,255,0.15)",
        bgcolor: "#ffffff",
      }}
    >
      <Typography sx={{ fontSize: { xs: "0.6rem", sm: "0.65rem" }, fontWeight: 700, color: "#0a0a2e", letterSpacing: 3, textTransform: "uppercase" }}>
        Lucia Rasoanirina
      </Typography>
      <Stack direction="row" spacing={0.8} alignItems="center">
        <Typography sx={{ fontSize: { xs: "0.55rem", sm: "0.6rem" }, fontWeight: 600, color: "#0050FF", letterSpacing: 2 }}>
          {label}
        </Typography>
        <Box sx={{ width: 20, height: 20, bgcolor: "#0050FF", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 9 }}>
          LR
        </Box>
      </Stack>
    </Stack>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mb: { xs: 0.6, sm: 0.8 } }}>
      <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#0050FF", flexShrink: 0 }} />
      <Typography sx={{ fontSize: { xs: "0.58rem", sm: "0.66rem" }, fontWeight: 700, color: "#0050FF", letterSpacing: 1.8, textTransform: "uppercase" }}>
        {children}
      </Typography>
    </Stack>
  );
}

function SectionBlock({ children, tint = true }: { children: ReactNode; tint?: boolean }) {
  return (
    <Box
      sx={{
        borderRadius: 2,
        p: { xs: 1.1, sm: 1.4 },
        bgcolor: tint ? "rgba(0,80,255,0.03)" : "transparent",
      }}
    >
      {children}
    </Box>
  );
}

/* DOS DU LIVRE */
function BookSpine() {
  return (
    <Box
      sx={{
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: { xs: 20, md: 28 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: "#f5f0eb",
        borderRadius: "4px 0 0 4px",
        borderRight: "2px solid rgba(0,0,0,0.06)",
        boxShadow: "inset -6px 0 16px rgba(0,0,0,0.04)",
        zIndex: 5,
        overflow: "hidden",
        pointerEvents: "none",
        py: 2.5,
      }}
    >
      <Typography
        sx={{
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
          color: "#0050FF",
          fontWeight: 700,
          letterSpacing: 4,
          fontSize: { xs: "0.5rem", md: "0.6rem" },
          whiteSpace: "nowrap",
          opacity: 0.9,
        }}
      >
        LUCIA RASOANIRINA · CV
      </Typography>
      <Box
        sx={{
          width: { xs: 22, md: 30 },
          height: { xs: 22, md: 30 },
          bgcolor: "#0050FF",
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: 800,
          fontSize: { xs: 9, md: 12 },
          boxShadow: "0 4px 12px rgba(0,80,255,0.3)",
        }}
      >
        LR
      </Box>
    </Box>
  );
}

/* Bande "code-barres" décorative */
function BarcodeBlock() {
  const bars = [2, 1, 1, 3, 1, 2, 1, 1, 3, 2, 1, 1, 2, 1, 3, 1, 1, 2];
  return (
    <Box sx={{ textAlign: "left" }}>
      <Stack direction="row" spacing={0.3} alignItems="flex-end" sx={{ height: 26 }}>
        {bars.map((w, i) => (
          <Box key={i} sx={{ width: w, height: i % 4 === 0 ? "100%" : "65%", bgcolor: "#0a0a2e" }} />
        ))}
      </Stack>
      <Typography sx={{ fontSize: "0.55rem", color: "#888", letterSpacing: 0.5, mt: 0.3 }}>
        CV-2026-LR-001
      </Typography>
    </Box>
  );
}

export default function CvLivre({ onClose }: CvLivreProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [flip, setFlip] = useState<{ from: number; to: number; dir: "next" | "prev" } | null>(null);
  const [qrUrl, setQrUrl] = useState<string>("");
  const [coverSlideUp, setCoverSlideUp] = useState(false);
  const [coverSlideDown, setCoverSlideDown] = useState(false);

  const PORTFOLIO_URL = window.location.origin.includes("localhost")
    ? "https://lucia-rasoanirina-portfolio.netlify.app"
    : window.location.origin;

  const CV_FILE_URL = "/CV_Lucia_Rasoanirina.pdf";

  useEffect(() => {
    QRCode.toDataURL(PORTFOLIO_URL, {
      width: 260,
      margin: 1,
      color: { dark: "#0a0a2e", light: "#ffffff" },
    })
      .then(setQrUrl)
      .catch(() => {});
  }, [PORTFOLIO_URL]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.top = `-${window.scrollY}px`;

    return () => {
      const scrollY = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    };
  }, []);

  const FLIP_MS = 750;

  const goTo = (to: number, dir: "next" | "prev") => {
    if (flip || to < 0 || to > 2) return;
    setFlip({ from: currentPage, to, dir });
    window.setTimeout(() => {
      setCurrentPage(to);
      setFlip(null);
    }, FLIP_MS);
  };

  const nextPage = () => goTo(currentPage + 1, "next");
  const prevPage = () => goTo(currentPage - 1, "prev");

  const toggleBook = () => {
    if (!flip) {
      if (!isBookOpen) {
        // Ouvrir le livre avec animation de la couverture qui monte
        setCoverSlideUp(true);
        setTimeout(() => {
          setIsBookOpen(true);
          setCoverSlideUp(false);
        }, 600);
      } else {
        // Fermer le livre - la couverture descend du haut
        setCoverSlideDown(true);
        setTimeout(() => {
          setIsBookOpen(false);
          setCoverSlideDown(false);
        }, 600);
      }
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextPage();
      else if (e.key === "ArrowLeft") prevPage();
      else if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Pages intérieures
  const innerPages = [
    // Page 0 - Profil et compétences (avec flèche de retour vers la couverture)
    <Box key="inner-0" sx={{ display: "flex", flexDirection: "column", minHeight: { xs: "auto", md: "80vh" }, height: "100%", position: "relative" }}>
      <PageHeader label="PROFIL & COMPÉTENCES" />
      
      {/* Flèche de retour vers la couverture - positionnée au milieu à gauche */}
      <Box
        onClick={toggleBook}
        sx={{
          position: "absolute",
          top: "50%",
          left: { xs: 0, sm: 0, md: 0 },
          transform: "translateY(-50%)",
          zIndex: 15,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: { xs: 30, sm: 40, md: 50 },
          height: { xs: 60, sm: 80, md: 100 },
          cursor: "pointer",
          color: "rgba(0,80,255,0)",
          transition: "all 0.3s ease",
          "&:hover": {
            color: "rgba(0,80,255,0.6)",
            background: "linear-gradient(90deg, rgba(0,80,255,0.08), rgba(0,80,255,0))",
          },
        }}
      >
        <NavigateBefore sx={{ fontSize: { xs: 30, md: 44 } }} />
      </Box>

      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, flex: 1, pt: { xs: 1, sm: 2 } }}>
        <Box sx={{ width: { xs: "100%", md: "50%" }, bgcolor: "#fafbff", p: { xs: 1.5, sm: 2, md: 3 }, borderRight: { xs: "none", md: "1px solid rgba(0,80,255,0.12)" } }}>
          <Stack spacing={{ xs: 1, sm: 1.2 }}>
            <SectionBlock>
              <SectionTitle>Profil</SectionTitle>
              <Typography sx={{ fontSize: { xs: "0.66rem", sm: "0.74rem", md: "0.78rem" }, color: "#444", lineHeight: 1.55 }}>
                Developpeuse Full-Stack passionnee, entree dans le monde de la technologie en 2023. Animee par une forte envie d'apprendre et de construire des solutions numeriques modernes. Preference marquee pour Python.
              </Typography>
            </SectionBlock>

            <SectionBlock>
              <SectionTitle>Informations</SectionTitle>
              <Stack direction="row" flexWrap="wrap" columnGap={2.5} rowGap={0.6}>
                <Box><Typography sx={{ fontSize: { xs: "0.55rem", sm: "0.6rem" }, color: "#888" }}>Naissance</Typography><Typography sx={{ fontSize: { xs: "0.68rem", sm: "0.74rem" }, color: "#333", fontWeight: 500 }}>17/10/2005</Typography></Box>
                <Box><Typography sx={{ fontSize: { xs: "0.55rem", sm: "0.6rem" }, color: "#888" }}>Lieu</Typography><Typography sx={{ fontSize: { xs: "0.68rem", sm: "0.74rem" }, color: "#333", fontWeight: 500 }}>Ankofafa, Fianarantsoa</Typography></Box>
                <Box><Typography sx={{ fontSize: { xs: "0.55rem", sm: "0.6rem" }, color: "#888" }}>Nationalite</Typography><Typography sx={{ fontSize: { xs: "0.68rem", sm: "0.74rem" }, color: "#333", fontWeight: 500 }}>Malagasy</Typography></Box>
              </Stack>
            </SectionBlock>

            <SectionBlock>
              <SectionTitle>Langues</SectionTitle>
              <Stack spacing={0.6}>
                {[{ l: "Malagasy", lv: "Maternelle", w: "100%" }, { l: "Francais", lv: "DELF B2", w: "85%" }, { l: "Anglais", lv: "B2", w: "80%" }].map((x) => (
                  <Box key={x.l}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: { xs: "0.68rem", sm: "0.74rem" }, color: "#333" }}>{x.l}</Typography>
                      <Typography sx={{ fontSize: { xs: "0.6rem", sm: "0.66rem" }, color: "#0050FF", fontWeight: 600 }}>{x.lv}</Typography>
                    </Stack>
                    <Box sx={{ mt: 0.3, height: 3, bgcolor: "#e0e0e0", borderRadius: 2 }}><Box sx={{ width: x.w, height: 3, bgcolor: "#0050FF", borderRadius: 2 }} /></Box>
                  </Box>
                ))}
              </Stack>
            </SectionBlock>

            <SectionBlock>
              <SectionTitle>Certificats et Attestations</SectionTitle>
              <Stack spacing={0.6}>
                <Stack direction="row" spacing={1} alignItems="center"><CheckCircle sx={{ fontSize: 14, color: "#0050FF" }} /><Typography sx={{ fontSize: { xs: "0.66rem", sm: "0.72rem" }, color: "#333" }}>Certification Participation en Hackathon</Typography></Stack>
                <Stack direction="row" spacing={1} alignItems="center"><CheckCircle sx={{ fontSize: 14, color: "#0050FF" }} /><Typography sx={{ fontSize: { xs: "0.66rem", sm: "0.72rem" }, color: "#333" }}>Certificat en Informatique Bureautique</Typography></Stack>
                <Stack direction="row" spacing={1} alignItems="center"><CheckCircle sx={{ fontSize: 14, color: "#0050FF" }} /><Typography sx={{ fontSize: { xs: "0.66rem", sm: "0.72rem" }, color: "#333" }}>Attestation de stage 2 mois</Typography></Stack>
                <Stack direction="row" spacing={1} alignItems="center"><CheckCircle sx={{ fontSize: 14, color: "#0050FF" }} /><Typography sx={{ fontSize: { xs: "0.66rem", sm: "0.72rem" }, color: "#333" }}>Attestation Pix</Typography></Stack>
              </Stack>
            </SectionBlock>
          </Stack>
        </Box>

        <Box sx={{ width: { xs: "100%", md: "50%" }, p: { xs: 1.5, sm: 2, md: 3 }, bgcolor: "#ffffff" }}>
          <Stack spacing={{ xs: 1, sm: 1.2 }}>
            <SectionBlock tint={false}>
              <SectionTitle>Formation</SectionTitle>
              <Box sx={{ mb: 1.2 }}>
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between"><Typography sx={{ fontWeight: 600, fontSize: { xs: "0.72rem", sm: "0.8rem" }, color: "#1a1a2e" }}>Licence en Developpement d'Applications</Typography><Typography sx={{ fontSize: { xs: "0.6rem", sm: "0.68rem" }, color: "#0050FF", fontWeight: 500 }}>2023 - Present</Typography></Stack>
                <Typography sx={{ fontSize: { xs: "0.64rem", sm: "0.7rem" }, color: "#666" }}>3eme annee - EMIT, Universite de Fianarantsoa</Typography>
              </Box>
              <Box>
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between"><Typography sx={{ fontWeight: 600, fontSize: { xs: "0.72rem", sm: "0.8rem" }, color: "#1a1a2e" }}>Baccalaureat serie C</Typography><Typography sx={{ fontSize: { xs: "0.6rem", sm: "0.68rem" }, color: "#0050FF", fontWeight: 500 }}>2023</Typography></Stack>
                <Typography sx={{ fontSize: { xs: "0.64rem", sm: "0.7rem" }, color: "#666" }}>Lycee FMJ - Talatamaty, Fianarantsoa</Typography>
              </Box>
            </SectionBlock>

            <SectionBlock tint={false}>
              <SectionTitle>Competences Techniques</SectionTitle>
              <Grid container spacing={1}>
                {[
                  { t: "Frontend", items: ["React.js", "Vue.js", "Next.js", "TypeScript", "Tailwind CSS"] },
                  { t: "Backend", items: ["PHP / Laravel", "Node.js", "Python", "NestJS"] },
                  { t: "Mobile", items: ["Flutter"] },
                  { t: "Base de donnees", items: ["MySQL", "PostgreSQL", "MongoDB"] },
                  { t: "Outils", items: ["Git", "Figma", "Netlify", "Supabase", "Neon", "Vercel", "Render"] },
                ].map((g) => (
                  <Grid key={g.t} size={{ xs: 12, sm: 6 }}>
                    <Stack spacing={0.4}>
                      <Typography sx={{ fontSize: { xs: "0.6rem", sm: "0.68rem" }, fontWeight: 600, color: "#333" }}>{g.t}</Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.3 }}>
                        {g.items.map((s) => (
                          <Box key={s} sx={{ bgcolor: "rgba(0,80,255,0.08)", color: "#0050FF", px: 0.8, py: 0.2, borderRadius: 10, fontSize: { xs: "0.52rem", sm: "0.58rem" }, fontWeight: 500 }}>{s}</Box>
                        ))}
                      </Box>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </SectionBlock>

            <SectionBlock>
              <SectionTitle>Centres d'interet</SectionTitle>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {["Cinema", "Series", "Tele-realite", "Basket-ball", "Cuisine", "Sport"].map((item) => (
                  <Box key={item} sx={{ bgcolor: "rgba(0,80,255,0.08)", color: "#0050FF", px: 1, py: 0.35, borderRadius: 20, fontSize: { xs: "0.58rem", sm: "0.64rem" }, fontWeight: 500 }}>{item}</Box>
                ))}
              </Box>
            </SectionBlock>
          </Stack>
        </Box>
      </Box>
    </Box>,

    // Page 1 - Projets et contact (avec tous les projets du portfolio)
    <Box key="inner-1" sx={{ display: "flex", flexDirection: "column", minHeight: { xs: "auto", md: "80vh" }, height: "100%" }}>
      <PageHeader label="PROJETS & CONTACT" />
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, flex: 1 }}>
        <Box sx={{ width: { xs: "100%", md: "50%" }, bgcolor: "#fafbff", p: { xs: 1.5, sm: 2, md: 3 }, borderRight: { xs: "none", md: "1px solid rgba(0,80,255,0.12)" } }}>
          <Stack spacing={{ xs: 1, sm: 1.2 }}>
            <SectionBlock tint={false}>
              <SectionTitle>Projets</SectionTitle>
              <Grid container spacing={1}>
                {[
                  { n: "UltimateChild", d: "Site vitrine educatif", t: ["HTML5", "CSS3", "JavaScript"] },
                  { n: "Garage Pro", d: "Gestion de garage", t: ["HTML5", "CSS3", "JavaScript"] },
                  { n: "'Parentia", d: "Plateforme parentale ", t: ["Vue 3", "Vite", "WebSocket", "Spring Boot", "PostgreSQL"] },
                  { n: "UrbanFlow IA", d: "Hackathon - mobilité urbaine IA", t: ["React", "Node.js", "Python", "Flutter"] },
                  { n: "Fianar Smart City", d: "Plateforme citoyenne pour la ville de Fianarantsoa :signalements urbain,IA de priorisation automatique", t: ["Next.js", "Nest.js", "PostgreSQL"] },
                  { n: "OuraTable", d: "Réseau social culinaire Laravel", t: ["Laravel", "MySQL", "Vue.js"] },
                  { n: "Packet Love Destiny", d: "Jeu interactif Python Tkinter", t: ["Python", "Tkinter"] },
                  { n: "Portfolio 3D", d: "Portfolio interactif Three.js", t: ["Three.js", "React", "WebGL"] },
                  { n: "FeedbackPro", d: "App mobile de feedback anonyme", t: ["React Native", "Firebase"] },
                ].map((p) => (
                  <Grid key={p.n} size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ bgcolor: "rgba(0,80,255,0.05)", p: 1.2, borderRadius: 2, height: "100%" }}>
                      <Typography sx={{ fontWeight: 600, fontSize: { xs: "0.7rem", sm: "0.76rem" }, color: "#1a1a2e" }}>{p.n}</Typography>
                      <Typography sx={{ fontSize: { xs: "0.56rem", sm: "0.62rem" }, color: "#666" }}>{p.d}</Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.3, mt: 0.4 }}>
                        {p.t.map((t) => (
                          <Box key={t} sx={{ bgcolor: "rgba(0,80,255,0.08)", color: "#0050FF", px: 0.7, py: 0.15, borderRadius: 10, fontSize: { xs: "0.48rem", sm: "0.54rem" } }}>{t}</Box>
                        ))}
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </SectionBlock>
          </Stack>
        </Box>

        <Box sx={{ width: { xs: "100%", md: "50%" }, p: { xs: 1.5, sm: 2, md: 3 }, bgcolor: "#ffffff", display: "flex", flexDirection: "column", justifyContent: "center", gap: 1.2 }}>
          <SectionBlock>
              <SectionTitle>Experiences</SectionTitle>
              <Stack spacing={0.8}>
                <Typography sx={{ fontSize: { xs: "0.66rem", sm: "0.72rem" }, color: "#444", lineHeight: 1.5 }}>
                  Participation a 2 Hackathons · Projets de groupe universitaires
                </Typography>
                <Box sx={{ bgcolor: "rgba(0,80,255,0.05)", p: 1, borderRadius: 2 }}>
                  <Typography sx={{ fontSize: { xs: "0.6rem", sm: "0.66rem" }, color: "#0050FF", fontWeight: 600 }}>
                    Stage L2 - 2 mois
                  </Typography>
                  <Typography sx={{ fontSize: { xs: "0.55rem", sm: "0.6rem" }, color: "#666" }}>
                    Gestion d'une maison de production audio
                  </Typography>
                </Box>
              </Stack>
          </SectionBlock>

          <SectionBlock tint={false}>
            <SectionTitle>Contact</SectionTitle>
            <Stack spacing={1.2}>
              <Stack direction="row" spacing={1.5} alignItems="center"><Email sx={{ color: "#0050FF", fontSize: 20 }} /><Box><Typography sx={{ fontSize: "0.58rem", color: "#888" }}>Email</Typography><Typography sx={{ fontSize: { xs: "0.68rem", sm: "0.74rem" }, color: "#333", fontWeight: 500 }}>luciarasoanirina8@gmail.com</Typography></Box></Stack>
              <Stack direction="row" spacing={1.5} alignItems="center"><Phone sx={{ color: "#0050FF", fontSize: 20 }} /><Box><Typography sx={{ fontSize: "0.58rem", color: "#888" }}>Telephone</Typography><Typography sx={{ fontSize: { xs: "0.68rem", sm: "0.74rem" }, color: "#333", fontWeight: 500 }}>+261 38 39 702 36</Typography></Box></Stack>
              <Stack direction="row" spacing={1.5} alignItems="center"><LocationOn sx={{ color: "#0050FF", fontSize: 20 }} /><Box><Typography sx={{ fontSize: "0.58rem", color: "#888" }}>Localisation</Typography><Typography sx={{ fontSize: { xs: "0.68rem", sm: "0.74rem" }, color: "#333", fontWeight: 500 }}>Fianarantsoa, Madagascar</Typography></Box></Stack>
            </Stack>
          </SectionBlock>

          <SectionBlock>
            <SectionTitle>Disponibilite</SectionTitle>
            <Box sx={{ display: "inline-block", bgcolor: "rgba(34,197,94,0.1)", color: "#22c55e", px: 2, py: 0.6, borderRadius: 30, fontWeight: 600, fontSize: { xs: "0.66rem", sm: "0.72rem" } }}>Disponible pour mission</Box>
          </SectionBlock>
        </Box>
      </Box>
    </Box>,

    // Page 2 - Dos du livre (verso)
    <Box
      key="back"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: { xs: 1.2, md: 1.6 },
        height: "100%",
        minHeight: { xs: "70vh", md: "80vh" },
        p: { xs: 3, md: 4 },
        pb: { xs: 5, md: 6 },
        textAlign: "center",
        bgcolor: "#ffffff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box sx={{ position: "absolute", top: -120, left: -120, width: 360, height: 360, borderRadius: "50%", background: "rgba(0,80,255,0.05)", filter: "blur(60px)" }} />

      <Box sx={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420 }}>
        <Typography sx={{ fontSize: { xs: "0.6rem", md: "0.7rem" }, letterSpacing: 5, color: "#0050FF", fontWeight: 700, mb: 1 }}>
          RESTONS EN CONTACT
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#0a0a2e", fontSize: { xs: "1.3rem", md: "1.9rem" }, mb: 2 }}>
          Merci de votre visite
        </Typography>

        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
          {[
            { icon: <Facebook />, href: "https://web.facebook.com/mariallucia.lucia.35?locale=fr_FR" },
            { icon: <LinkedIn />, href: "https://www.linkedin.com/in/lucia-rasoanirina/" },
            { icon: <GitHub />, href: "https://github.com/Lucia-RASOANIRINA" },
            { icon: <Instagram />, href: "https://www.instagram.com/rasoanirinambolatiana" },
          ].map((s, i) => (
            <IconButton
              key={i}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: "#0050FF", bgcolor: "rgba(0,80,255,0.08)", "&:hover": { bgcolor: "#0050FF", color: "#fff", transform: "translateY(-3px)" }, transition: "all 0.3s" }}
            >
              {s.icon}
            </IconButton>
          ))}
        </Stack>

        <Box sx={{ textAlign: "left", border: "1px solid rgba(0,80,255,0.12)", borderRadius: 2, p: { xs: 1.4, md: 1.8 }, mb: 2, bgcolor: "#fafbff" }}>
          <Typography sx={{ fontSize: "0.62rem", fontWeight: 700, color: "#0050FF", letterSpacing: 2, mb: 1, textAlign: "center" }}>
            À PROPOS
          </Typography>
          <Typography sx={{ fontSize: { xs: "0.66rem", md: "0.73rem" }, color: "#444", lineHeight: 1.65, textAlign: "center" }}>
            Developpeuse Full-Stack basee a Fianarantsoa, Madagascar, actuellement en 3eme annee de Licence a l'EMIT. Disponible pour des missions freelance ou des collaborations.
          </Typography>
        </Box>

        <Stack spacing={0.5} sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <Email sx={{ color: "#0050FF", fontSize: 18 }} />
            <Typography sx={{ fontSize: { xs: "0.7rem", md: "0.78rem" }, color: "#333" }}>luciarasoanirina8@gmail.com</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <Phone sx={{ color: "#0050FF", fontSize: 18 }} />
            <Typography sx={{ fontSize: { xs: "0.7rem", md: "0.78rem" }, color: "#333" }}>+261 38 39 702 36</Typography>
          </Stack>
        </Stack>

        <Box
          sx={{
            display: "inline-flex",
            p: 1.2,
            bgcolor: "#fff",
            borderRadius: 3,
            border: "2px solid rgba(0,80,255,0.15)",
            boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
          }}
        >
          {qrUrl ? (
            <Box component="img" src={qrUrl} alt="QR code CV" sx={{ width: { xs: 104, md: 128 }, height: { xs: 104, md: 128 }, display: "block" }} />
          ) : (
            <Box sx={{ width: { xs: 104, md: 128 }, height: { xs: 104, md: 128 } }} />
          )}
        </Box>
        <Typography sx={{ mt: 1, mb: 2, fontSize: "0.64rem", color: "#888", letterSpacing: 0.5 }}>
          Scannez pour télécharger mon CV
        </Typography>

        <Button
          component="a"
          href={CV_FILE_URL}
          download="CV_Lucia_Rasoanirina.pdf"
          variant="contained"
          startIcon={<Download />}
          onClick={(e) => e.stopPropagation()}
          sx={{
            bgcolor: "#0050FF",
            borderRadius: 30,
            px: 4,
            py: 1.2,
            fontWeight: 700,
            textTransform: "none",
            boxShadow: "0 10px 24px rgba(0,80,255,0.3)",
            position: "relative",
            zIndex: 20,
            "&:hover": {
              bgcolor: "#003bb5",
            },
            transition: "background-color 0.3s",
          }}
        >
          Télécharger le CV
        </Button>
      </Box>

      <Box sx={{ position: "absolute", left: { xs: 16, md: 28 }, bottom: { xs: 14, md: 20 } }}>
        <BarcodeBlock />
      </Box>
    </Box>,
  ];

  const basePage = flip ? flip.to : (isBookOpen ? currentPage : 0);
  const frontPage = flip ? (flip.dir === "next" ? flip.from : flip.to) : (isBookOpen ? currentPage : 0);
  const backPage = flip ? (flip.dir === "next" ? flip.to : flip.from) : (isBookOpen ? currentPage : 0);

  const canPrev = isBookOpen && currentPage > 0 && !flip;
  const canNext = isBookOpen && currentPage < innerPages.length - 1 && !flip;

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        bgcolor: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(6px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 1, sm: 2, md: 3 },
        animation: "cvFadeIn 0.4s ease",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1000,
          height: { xs: "86vh", md: "85vh" },
          maxHeight: "92vh",
          position: "relative",
          animation: "cvBookIn 0.5s cubic-bezier(0.2, 0.9, 0.3, 1.1)",
        }}
      >
        <Box sx={{ position: "absolute", top: -10, right: -10, zIndex: 30, bgcolor: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", borderRadius: "50%", p: 0.5, "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}>
          <IconButton onClick={onClose} sx={{ color: "#fff", "&:hover": { transform: "rotate(90deg)" }, transition: "transform 0.3s ease" }}><Close /></IconButton>
        </Box>

        <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
          {/* Ombre portée */}
          <Box sx={{ position: "absolute", inset: 0, borderRadius: { xs: 2, md: 3 }, bgcolor: "#e8e2da", transform: "translate(3px, 4px)", boxShadow: "0 40px 90px rgba(0,0,0,0.5)", zIndex: 0 }} />
          
          {/* Pages empilées */}
          {[16, 12, 8, 4].map((offset, i) => (
            <Box key={offset} sx={{ position: "absolute", top: i + 1, bottom: i + 1, right: -3 - i, width: 8, borderRadius: 1, bgcolor: i % 2 ? "#fbf9f6" : "#eef0f3", display: { xs: "none", md: "block" }, zIndex: 0 }} />
          ))}

          {/* DOS DU LIVRE */}
          <BookSpine />

          {/* COUVERTURE - avec animation slide up type PowerPoint */}
          {!isBookOpen && !coverSlideUp && !coverSlideDown && (
            <Box
              onClick={toggleBook}
              sx={{
                position: "absolute",
                left: { xs: 20, md: 28 },
                right: 0,
                top: 0,
                bottom: 0,
                bgcolor: "#faf8f5",
                borderRadius: { xs: "0 12px 12px 0", md: "0 12px 12px 0" },
                zIndex: 10,
                cursor: "pointer",
                overflow: "hidden",
                boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04)",
                transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  "& .cover-hover-overlay": {
                    opacity: 1,
                  },
                  "& .cover-image": {
                    transform: "scale(1.05) rotate(-2deg)",
                  },
                  "& .cover-title": {
                    transform: "scale(1.02)",
                  },
                },
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                p: { xs: 3, md: 5 },
              }}
            >
              {/* Fond avec texture papier */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background: `
                    radial-gradient(ellipse at 30% 20%, rgba(255,215,180,0.08) 0%, transparent 60%),
                    radial-gradient(ellipse at 70% 80%, rgba(200,180,160,0.06) 0%, transparent 50%),
                    radial-gradient(ellipse at 50% 100%, rgba(180,160,140,0.05) 0%, transparent 40%),
                    linear-gradient(180deg, #faf8f5 0%, #f5f0eb 40%, #f0ebe4 100%)
                  `,
                  zIndex: 0,
                }}
              />

              {/* Lignes décoratives */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 0,
                  opacity: 0.04,
                  backgroundImage: `
                    linear-gradient(rgba(0,0,0,0.2) 1px, transparent 1px)
                  `,
                  backgroundSize: '100% 28px',
                }}
              />

              {/* Cadre décoratif */}
              <Box
                sx={{
                  position: "absolute",
                  inset: { xs: 20, md: 30 },
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: "4px",
                  zIndex: 0,
                  pointerEvents: "none",
                }}
              />

              {/* Coins décoratifs */}
              {[
                { top: 25, left: 25 },
                { top: 25, right: 25 },
                { bottom: 25, left: 25 },
                { bottom: 25, right: 25 }
              ].map((pos, i) => (
                <Box
                  key={i}
                  sx={{
                    position: "absolute",
                    ...pos,
                    width: { xs: 20, md: 30 },
                    height: { xs: 20, md: 30 },
                    zIndex: 0,
                    opacity: 0.06,
                    border: "1px solid #000",
                    borderTop: i < 2 ? "1px solid #000" : "none",
                    borderBottom: i >= 2 ? "1px solid #000" : "none",
                    borderLeft: i % 2 === 0 ? "1px solid #000" : "none",
                    borderRight: i % 2 === 1 ? "1px solid #000" : "none",
                    pointerEvents: "none",
                  }}
                />
              ))}

              {/* PARTIE GAUCHE - Texte centré */}
              <Box sx={{ 
                position: "relative", 
                zIndex: 1, 
                textAlign: "center", 
                width: "55%",
                pr: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    mb: 1.5,
                  }}
                >
                  <Box sx={{ height: 1.5, width: { xs: 15, md: 25 }, bgcolor: "rgba(0,0,0,0.1)", flexShrink: 0 }} />
                  <Typography sx={{ fontSize: { xs: "0.5rem", md: "0.6rem" }, letterSpacing: 3, color: "rgba(0,0,0,0.25)", fontWeight: 500, textTransform: "uppercase" }}>
                    OFF
                  </Typography>
                  <Box sx={{ height: 1.5, width: { xs: 15, md: 25 }, bgcolor: "rgba(0,0,0,0.1)", flexShrink: 0 }} />
                </Box>

                <Typography
                  className="cover-title"
                  sx={{
                    fontSize: { xs: "2.8rem", sm: "4rem", md: "5.5rem" },
                    fontWeight: 900,
                    letterSpacing: 6,
                    color: "#1a1a2e",
                    textShadow: "0 2px 20px rgba(0,0,0,0.03)",
                    lineHeight: 0.9,
                    mb: 0.5,
                    fontFamily: '"Times New Roman", "Georgia", serif',
                    transition: "transform 0.4s ease",
                  }}
                >
                  OFF
                </Typography>

                <Box
                  sx={{
                    width: 50,
                    height: 2,
                    bgcolor: "rgba(0,0,0,0.08)",
                    my: 1.5,
                  }}
                />

                <Typography
                  sx={{
                    fontSize: { xs: "1rem", sm: "1.3rem", md: "1.6rem" },
                    fontWeight: 700,
                    letterSpacing: 3,
                    color: "#2a2a3e",
                    fontFamily: '"Times New Roman", "Georgia", serif',
                    mb: 0.3,
                  }}
                >
                  LUCIA RASOANIRINA
                </Typography>

                <Typography
                  sx={{
                    fontSize: { xs: "0.5rem", sm: "0.6rem", md: "0.75rem" },
                    letterSpacing: 5,
                    color: "rgba(0,0,0,0.3)",
                    fontWeight: 400,
                    textTransform: "uppercase",
                    mb: 1,
                  }}
                >
                  Fullstack Developer
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    my: 1,
                  }}
                >
                  <Box sx={{ width: 15, height: 1, bgcolor: "rgba(0,0,0,0.1)" }} />
                  <Typography sx={{ fontSize: "0.5rem", color: "rgba(0,0,0,0.15)" }}>✦</Typography>
                  <Box sx={{ width: 15, height: 1, bgcolor: "rgba(0,0,0,0.1)" }} />
                </Box>

                <Typography
                  sx={{
                    fontSize: { xs: "0.6rem", md: "0.75rem" },
                    letterSpacing: 1.5,
                    color: "rgba(0,0,0,0.35)",
                    fontWeight: 400,
                    fontStyle: "italic",
                    maxWidth: "90%",
                    mx: "auto",
                    lineHeight: 1.6,
                  }}
                >
                  "Chaque ligne de code est une histoire qui attend d'être écrite."
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.8,
                    mt: 2,
                  }}
                >
                  <Box sx={{ height: 1, width: { xs: 12, md: 20 }, bgcolor: "rgba(0,0,0,0.06)", flexShrink: 0 }} />
                  <Typography
                    sx={{
                      fontSize: { xs: "0.35rem", md: "0.45rem" },
                      letterSpacing: 2.5,
                      color: "rgba(0,0,0,0.12)",
                      fontWeight: 600,
                      textTransform: "uppercase",
                    }}
                  >
                    OFF · UNOFFICIAL FANBOOK
                  </Typography>
                  <Box sx={{ height: 1, width: { xs: 12, md: 20 }, bgcolor: "rgba(0,0,0,0.06)", flexShrink: 0 }} />
                </Box>

                <Typography
                  className="cover-hover-overlay"
                  sx={{
                    mt: 1.5,
                    fontSize: "0.5rem",
                    letterSpacing: 2,
                    color: "rgba(0,0,0,0.15)",
                    opacity: 0,
                    transition: "opacity 0.4s ease",
                    fontWeight: 300,
                  }}
                >
                  📖 Ouvrir
                </Typography>
              </Box>

              {/* PARTIE DROITE - Photo avec animations 3D */}
              <Box
                className="cover-image"
                sx={{
                  position: "relative",
                  zIndex: 1,
                  width: "40%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  transformStyle: "preserve-3d",
                  animation: "cvPhotoFloat 4s ease-in-out infinite",
                }}
              >
                <Box
                  sx={{
                    width: { xs: 120, sm: 160, md: 200 },
                    height: { xs: 120, sm: 160, md: 200 },
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "3px solid rgba(0,0,0,0.06)",
                    boxShadow: `
                      0 20px 60px rgba(0,0,0,0.08),
                      0 0 0 1px rgba(0,0,0,0.02),
                      inset 0 -20px 40px rgba(0,0,0,0.04)
                    `,
                    animation: "cvPhotoPulse 3s ease-in-out infinite",
                    transform: "rotateY(0deg) rotateX(0deg)",
                    transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    "&:hover": {
                      transform: "rotateY(10deg) rotateX(-5deg) scale(1.05)",
                    },
                  }}
                >
                  <img
                    src="/photo-lucia.jpg"
                    alt="Lucia Rasoanirina"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.6s ease",
                    }}
                  />
                </Box>

                {/* Anneaux décoratifs */}
                <Box
                  sx={{
                    position: "absolute",
                    width: { xs: 150, sm: 190, md: 240 },
                    height: { xs: 150, sm: 190, md: 240 },
                    borderRadius: "50%",
                    border: "1px solid rgba(0,0,0,0.04)",
                    animation: "cvRingRotate 12s linear infinite",
                    pointerEvents: "none",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    width: { xs: 170, sm: 220, md: 280 },
                    height: { xs: 170, sm: 220, md: 280 },
                    borderRadius: "50%",
                    border: "1px solid rgba(0,0,0,0.02)",
                    animation: "cvRingRotate 15s linear infinite reverse",
                    pointerEvents: "none",
                  }}
                />

                {/* Points lumineux */}
                {[0, 60, 120, 180, 240, 300].map((deg) => (
                  <Box
                    key={deg}
                    sx={{
                      position: "absolute",
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      bgcolor: "rgba(0,0,0,0.04)",
                      top: "50%",
                      left: "50%",
                      transform: `rotate(${deg}deg) translateX(${110 + Math.random() * 20}px)`,
                      animation: `cvDotFloat ${2 + Math.random() * 3}s ease-in-out infinite alternate`,
                      pointerEvents: "none",
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Animation de la couverture qui monte vers le haut (ouverture) */}
          {coverSlideUp && (
            <Box
              sx={{
                position: "absolute",
                left: { xs: 20, md: 28 },
                right: 0,
                top: 0,
                bottom: 0,
                bgcolor: "#faf8f5",
                borderRadius: { xs: "0 12px 12px 0", md: "0 12px 12px 0" },
                zIndex: 10,
                overflow: "hidden",
                boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04)",
                animation: "cvCoverSlideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                p: { xs: 3, md: 5 },
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background: `
                    radial-gradient(ellipse at 30% 20%, rgba(255,215,180,0.08) 0%, transparent 60%),
                    radial-gradient(ellipse at 70% 80%, rgba(200,180,160,0.06) 0%, transparent 50%),
                    linear-gradient(180deg, #faf8f5 0%, #f5f0eb 40%, #f0ebe4 100%)
                  `,
                  zIndex: 0,
                }}
              />
              <Box sx={{ 
                position: "relative", 
                zIndex: 1, 
                textAlign: "center", 
                width: "55%",
                pr: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Typography
                  sx={{
                    fontSize: { xs: "2.8rem", sm: "4rem", md: "5.5rem" },
                    fontWeight: 900,
                    letterSpacing: 6,
                    color: "#1a1a2e",
                    lineHeight: 0.9,
                    fontFamily: '"Times New Roman", "Georgia", serif',
                  }}
                >
                  OFF
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "1rem", sm: "1.3rem", md: "1.6rem" },
                    fontWeight: 700,
                    letterSpacing: 3,
                    color: "#2a2a3e",
                    fontFamily: '"Times New Roman", "Georgia", serif',
                  }}
                >
                  LUCIA RASOANIRINA
                </Typography>
              </Box>
              <Box
                sx={{
                  position: "relative",
                  zIndex: 1,
                  width: "40%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: { xs: 120, sm: 160, md: 200 },
                    height: { xs: 120, sm: 160, md: 200 },
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "3px solid rgba(0,0,0,0.06)",
                    boxShadow: `0 20px 60px rgba(0,0,0,0.08)`,
                  }}
                >
                  <img
                    src="/photo-lucia.jpg"
                    alt="Lucia Rasoanirina"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              </Box>
            </Box>
          )}

          {/* Animation de la couverture qui descend du haut (fermeture) */}
          {coverSlideDown && (
            <Box
              sx={{
                position: "absolute",
                left: { xs: 20, md: 28 },
                right: 0,
                top: "-100%",
                bottom: "100%",
                bgcolor: "#faf8f5",
                borderRadius: { xs: "0 12px 12px 0", md: "0 12px 12px 0" },
                zIndex: 10,
                overflow: "hidden",
                boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04)",
                animation: "cvCoverSlideDown 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                p: { xs: 3, md: 5 },
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background: `
                    radial-gradient(ellipse at 30% 20%, rgba(255,215,180,0.08) 0%, transparent 60%),
                    radial-gradient(ellipse at 70% 80%, rgba(200,180,160,0.06) 0%, transparent 50%),
                    linear-gradient(180deg, #faf8f5 0%, #f5f0eb 40%, #f0ebe4 100%)
                  `,
                  zIndex: 0,
                }}
              />
              <Box sx={{ 
                position: "relative", 
                zIndex: 1, 
                textAlign: "center", 
                width: "55%",
                pr: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Typography
                  sx={{
                    fontSize: { xs: "2.8rem", sm: "4rem", md: "5.5rem" },
                    fontWeight: 900,
                    letterSpacing: 6,
                    color: "#1a1a2e",
                    lineHeight: 0.9,
                    fontFamily: '"Times New Roman", "Georgia", serif',
                  }}
                >
                  OFF
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "1rem", sm: "1.3rem", md: "1.6rem" },
                    fontWeight: 700,
                    letterSpacing: 3,
                    color: "#2a2a3e",
                    fontFamily: '"Times New Roman", "Georgia", serif',
                  }}
                >
                  LUCIA RASOANIRINA
                </Typography>
              </Box>
              <Box
                sx={{
                  position: "relative",
                  zIndex: 1,
                  width: "40%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: { xs: 120, sm: 160, md: 200 },
                    height: { xs: 120, sm: 160, md: 200 },
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "3px solid rgba(0,0,0,0.06)",
                    boxShadow: `0 20px 60px rgba(0,0,0,0.08)`,
                  }}
                >
                  <img
                    src="/photo-lucia.jpg"
                    alt="Lucia Rasoanirina"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              </Box>
            </Box>
          )}

          {/* PAGES INTÉRIEURES */}
          {isBookOpen && (
            <Box
              sx={{
                position: "absolute",
                left: { xs: 20, md: 28 },
                right: 0,
                top: 0,
                bottom: 0,
                bgcolor: "#ffffff",
                borderRadius: { xs: "0 12px 12px 0", md: "0 12px 12px 0" },
                zIndex: 1,
                overflow: "hidden",
                boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.03)",
                animation: "cvBookOpen 0.6s cubic-bezier(0.2, 0.9, 0.3, 1.1)",
              }}
            >
              <PageScroller>{innerPages[basePage]}</PageScroller>
            </Box>
          )}

          {/* Fermeture du livre (X) */}
          {isBookOpen && (
            <Box
              onClick={toggleBook}
              sx={{
                position: "absolute",
                top: { xs: 8, md: 12 },
                right: { xs: 8, md: 12 },
                zIndex: 15,
                bgcolor: "rgba(0,0,0,0.04)",
                borderRadius: "50%",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: "rgba(0,0,0,0.08)",
                  transform: "scale(1.1)",
                },
              }}
            >
              <Typography sx={{ fontSize: "0.65rem", color: "#666" }}>✕</Typography>
            </Box>
          )}

          {/* Navigation - flèches de chaque côté pour changer de page */}
          {isBookOpen && (
            <>
              {canPrev && (
                <Box
                  onClick={prevPage}
                  sx={{
                    position: "absolute", top: 0, bottom: 0, left: 0,
                    width: { xs: "12%", md: "10%" },
                    zIndex: 9, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "flex-start", pl: 1,
                    color: "rgba(0,80,255,0)",
                    transition: "all 0.3s",
                    "&:hover": { color: "rgba(0,80,255,0.6)", background: "linear-gradient(90deg, rgba(0,80,255,0.08), rgba(0,80,255,0))" },
                  }}
                >
                  <NavigateBefore sx={{ fontSize: { xs: 30, md: 44 } }} />
                </Box>
              )}
              {canNext && (
                <Box
                  onClick={nextPage}
                  sx={{
                    position: "absolute", top: 0, bottom: 0, right: 0,
                    width: { xs: "12%", md: "10%" },
                    zIndex: 9, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "flex-end", pr: 1,
                    color: "rgba(0,80,255,0)",
                    transition: "all 0.3s",
                    "&:hover": { color: "rgba(0,80,255,0.6)", background: "linear-gradient(270deg, rgba(0,80,255,0.08), rgba(0,80,255,0))" },
                  }}
                >
                  <NavigateNext sx={{ fontSize: { xs: 30, md: 44 } }} />
                </Box>
              )}
            </>
          )}

          {/* Pliure centrale */}
          {isBookOpen && (
            <Box
              sx={{
                position: "absolute",
                left: { xs: "50%", md: `calc(50% + 14px)` },
                top: 0,
                bottom: 0,
                width: 3,
                transform: "translateX(-50%)",
                zIndex: 6,
                background: "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.03) 40%, rgba(0,0,0,0.06) 50%, rgba(0,0,0,0.03) 60%, rgba(0,0,0,0) 100%)",
                pointerEvents: "none",
              }}
            />
          )}

          {/* Animation de retournement - SEULE LA PARTIE DROITE TOURNE */}
          {flip && (
            <Box
              sx={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: "50%",
                transformStyle: "preserve-3d",
                transformOrigin: "left center",
                zIndex: 12,
                perspective: "2200px",
                animation: `${flip.dir === "next" ? "cvFlipNext" : "cvFlipPrev"} ${FLIP_MS}ms cubic-bezier(0.4, 0, 0.2, 1) forwards`,
                "&::after": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  borderRadius: { xs: 2, md: 3 },
                  pointerEvents: "none",
                  background: "linear-gradient(90deg, rgba(0,0,0,0.25), rgba(0,0,0,0) 35%)",
                  animation: `cvFlipShade ${FLIP_MS}ms ease forwards`,
                },
              }}
            >
              <Box sx={{ position: "absolute", inset: 0, bgcolor: "#fff", borderRadius: { xs: 2, md: 3 }, overflow: "hidden", backfaceVisibility: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
                <PageScroller>{innerPages[frontPage]}</PageScroller>
              </Box>
              <Box sx={{ position: "absolute", inset: 0, bgcolor: "#fff", borderRadius: { xs: 2, md: 3 }, overflow: "hidden", backfaceVisibility: "hidden", transform: "rotateY(180deg)", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
                <PageScroller>{innerPages[backPage]}</PageScroller>
              </Box>
            </Box>
          )}
        </Box>

        {/* Pied de page */}
        <Box sx={{ position: "absolute", bottom: -20, left: 0, right: 0, display: "flex", justifyContent: "flex-end", alignItems: "center", px: { xs: 1, sm: 2 }, py: 1, zIndex: 20 }}>
          <Typography sx={{ color: "rgba(255,255,255,0.3)", fontSize: { xs: "0.5rem", sm: "0.6rem" } }}>
            {isBookOpen ? `${currentPage + 1} / ${innerPages.length}` : "OFF"}
          </Typography>
        </Box>
      </Box>

      <style>{`
        @keyframes cvFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes cvBookIn { from { opacity: 0; transform: translateY(30px) scale(0.94); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes cvBookOpen { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
        @keyframes cvFlipNext { from { transform: rotateY(0deg); } to { transform: rotateY(-180deg); } }
        @keyframes cvFlipPrev { from { transform: rotateY(-180deg); } to { transform: rotateY(0deg); } }
        @keyframes cvFlipShade { 0% { opacity: 0; } 45% { opacity: 1; } 100% { opacity: 0; } }
        
        @keyframes cvCoverSlideUp {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-100%); opacity: 0; }
        }
        
        @keyframes cvCoverSlideDown {
          0% { transform: translateY(0); opacity: 0; }
          100% { transform: translateY(100%); opacity: 1; }
        }
        
        @keyframes cvPhotoFloat {
          0%, 100% { transform: translateY(0px) rotateY(0deg); }
          50% { transform: translateY(-8px) rotateY(2deg); }
        }
        
        @keyframes cvPhotoPulse {
          0%, 100% { box-shadow: 0 20px 60px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02), inset 0 -20px 40px rgba(0,0,0,0.04); }
          50% { box-shadow: 0 25px 80px rgba(0,0,0,0.12), 0 0 0 2px rgba(0,80,255,0.05), inset 0 -20px 40px rgba(0,0,0,0.04); }
        }
        
        @keyframes cvRingRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes cvDotFloat {
          0% { opacity: 0.3; transform: rotate(var(--deg)) translateX(110px) scale(1); }
          100% { opacity: 0.8; transform: rotate(var(--deg)) translateX(130px) scale(1.5); }
        }
      `}</style>
    </Box>
  );
}

function PageScroller({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {children}
    </Box>
  );
}