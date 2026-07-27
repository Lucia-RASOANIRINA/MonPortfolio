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

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{
        mb: { xs: 1, sm: 1.5, md: 1.75 },
        pb: 0.8,
        borderBottom: "2px solid rgba(0,80,255,0.15)",
      }}
    >
      <Box
        sx={{
          width: { xs: 14, sm: 16 },
          height: { xs: 14, sm: 16 },
          borderRadius: "50%",
          bgcolor: "#0050FF",
          flexShrink: 0,
          boxShadow: "0 0 0 3px rgba(0,80,255,0.12)",
        }}
      />
      <Typography
        sx={{
          fontSize: { xs: "0.6rem", sm: "0.7rem" },
          fontWeight: 700,
          color: "#0050FF",
          letterSpacing: 2,
          textTransform: "uppercase",
        }}
      >
        {children}
      </Typography>
    </Stack>
  );
}

function SectionCard({ children, sx }: { children: ReactNode; sx?: object }) {
  return (
    <Box
      sx={{
        border: "1px solid rgba(0,80,255,0.10)",
        borderRadius: 2,
        p: { xs: 1.5, sm: 2 },
        bgcolor: "#fff",
        boxShadow: "0 2px 10px rgba(10,10,46,0.03)",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

/* Bande façon "tranche de livre" (cf. modèle 1) : toujours visible sur le
   bord gauche du livre, avec le nom en texte vertical. */
function BookSpine() {
  return (
    <Box
      sx={{
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: { xs: 0, md: 22 },
        display: { xs: "none", md: "flex" },
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#0050FF",
        borderRadius: "12px 0 0 12px",
        boxShadow: "inset -6px 0 12px rgba(0,0,0,0.25)",
        zIndex: 15,
        overflow: "hidden",
      }}
    >
      <Box sx={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)", width: 10, height: 10, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.5)" }} />
      <Typography
        sx={{
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
          color: "#fff",
          fontWeight: 700,
          letterSpacing: 3,
          fontSize: "0.62rem",
          whiteSpace: "nowrap",
        }}
      >
        LUCIA RASOANIRINA · FULLSTACK DEVELOPER
      </Typography>
      <Box sx={{ position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)", width: 10, height: 10, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.5)" }} />
    </Box>
  );
}

/* Petite bande façon "code-barres ISBN" pour rappeler le dos du modèle 1,
   purement décorative. */
function BarcodeStripe() {
  const bars = [2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 1, 2, 1, 3, 1, 2];
  return (
    <Stack direction="row" spacing={0.4} alignItems="flex-end" justifyContent="center" sx={{ height: 34, mt: 1 }}>
      {bars.map((w, i) => (
        <Box key={i} sx={{ width: w, height: i % 5 === 0 ? "100%" : "70%", bgcolor: "#0a0a2e" }} />
      ))}
    </Stack>
  );
}

export default function CvLivre({ onClose }: CvLivreProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [flip, setFlip] = useState<{ from: number; to: number; dir: "next" | "prev" } | null>(null);
  const [qrUrl, setQrUrl] = useState<string>("");

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
    if (flip || to < 0 || to > 3) return;
    setFlip({ from: currentPage, to, dir });
    window.setTimeout(() => {
      setCurrentPage(to);
      setFlip(null);
    }, FLIP_MS);
  };

  const nextPage = () => goTo(currentPage + 1, "next");
  const prevPage = () => goTo(currentPage - 1, "prev");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextPage();
      else if (e.key === "ArrowLeft") prevPage();
      else if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // ====== TELECHARGEMENT DU CV ======
  // Bug corrigé : l'ancien lien combinait `download` + `target="_blank"`.
  // Sur beaucoup de navigateurs (Safari / Chrome mobile en particulier),
  // ces deux attributs entrent en conflit : le navigateur ouvre un nouvel
  // onglet vide au lieu de déclencher le téléchargement. On construit donc
  // un lien de téléchargement "pur" (sans target/rel), et on vérifie d'abord
  // que le fichier existe réellement et qu'il s'agit bien d'un PDF (utile si
  // l'hébergeur — ex. Netlify — renvoie la page d'accueil en fallback quand
  // le fichier est introuvable, ce qui produisait un "faux succès").
  const handleDownloadPDF = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await fetch(CV_FILE_URL, { method: "HEAD" });
      const contentType = response.headers.get("content-type") || "";

      if (!response.ok || !contentType.toLowerCase().includes("pdf")) {
        // Le fichier n'existe pas (ou le serveur renvoie autre chose qu'un
        // PDF) : on ouvre quand même l'URL dans un nouvel onglet pour que
        // l'utilisateur voie ce qui se passe, plutôt que d'échouer en silence.
        window.open(CV_FILE_URL, "_blank", "noopener,noreferrer");
        return;
      }

      const link = document.createElement("a");
      link.href = CV_FILE_URL;
      link.download = "CV_Lucia_Rasoanirina.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Erreur de téléchargement:", error);
      window.open(CV_FILE_URL, "_blank", "noopener,noreferrer");
    }
  };

  const pages = [
    // Page 0 - Couverture (façon couverture de livre : bandeau titre + badge)
    <Box
      key="cover"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        minHeight: { xs: "70vh", md: "80vh" },
        p: { xs: 3, md: 5 },
        textAlign: "center",
        bgcolor: "#ffffff",
        color: "#0a0a2e",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box sx={{ position: "absolute", top: -120, right: -120, width: 360, height: 360, borderRadius: "50%", background: "rgba(0,80,255,0.05)", filter: "blur(60px)" }} />
      <Box sx={{ position: "absolute", bottom: -120, left: -120, width: 360, height: 360, borderRadius: "50%", background: "rgba(0,80,255,0.04)", filter: "blur(60px)" }} />

      {/* Bandeau "édition" façon bandeau auteur du modèle de couverture */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: 18, md: 26 },
          right: 0,
          bgcolor: "#0050FF",
          color: "#fff",
          px: { xs: 2, md: 2.5 },
          py: 0.6,
          fontSize: { xs: "0.58rem", md: "0.65rem" },
          fontWeight: 700,
          letterSpacing: 2,
          borderRadius: "8px 0 0 8px",
          boxShadow: "0 6px 16px rgba(0,80,255,0.35)",
        }}
      >
        ÉDITION 2026
      </Box>

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Typography sx={{ fontSize: { xs: "0.6rem", md: "0.72rem" }, letterSpacing: 6, color: "#0050FF", fontWeight: 700, mb: 3 }}>
          CURRICULUM VITAE
        </Typography>

        <Box sx={{ width: { xs: 44, md: 52 }, height: { xs: 44, md: 52 }, mx: "auto", mb: 3, bgcolor: "#0050FF", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: { xs: 18, md: 22 }, boxShadow: "0 10px 24px rgba(0,80,255,0.3)" }}>
          LR
        </Box>

        <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: "1.9rem", sm: "2.5rem", md: "3.4rem" }, letterSpacing: 1, color: "#0a0a2e" }}>
          Lucia Rasoanirina
        </Typography>

        <Box sx={{ width: 90, height: 3, bgcolor: "#0050FF", mx: "auto", my: 3, borderRadius: 2, boxShadow: "0 0 18px rgba(0,80,255,0.25)" }} />

        <Typography sx={{ fontSize: { xs: "0.85rem", sm: "1.05rem", md: "1.25rem" }, letterSpacing: 5, fontWeight: 400, color: "#555" }}>
          FULLSTACK DEVELOPER
        </Typography>

        <Typography sx={{ mt: 5, fontSize: "0.68rem", letterSpacing: 2, color: "#bbb" }}>
          Cliquez les bords ou les flèches pour tourner les pages →
        </Typography>
      </Box>
    </Box>,

    // Page 1 - Profil et informations (panneaux type brochure)
    <Box key="page1" sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, minHeight: { xs: "auto", md: "80vh" }, height: "100%" }}>
      <Box sx={{ width: { xs: "100%", md: "50%" }, bgcolor: "#fafbff", p: { xs: 2, sm: 3, md: 4 }, borderRight: { xs: "none", md: "1px solid rgba(0,80,255,0.12)" } }}>
        <Stack spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
          <SectionCard>
            <SectionTitle>Profil</SectionTitle>
            <Typography sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.85rem" }, color: "#444", lineHeight: 1.7 }}>
              Developpeuse Full-Stack passionnee, entree dans le monde de la technologie en 2023. Animee par une forte envie d'apprendre et de construire des solutions numeriques modernes. Preference marquee pour Python.
            </Typography>
          </SectionCard>

          <SectionCard>
            <SectionTitle>Informations</SectionTitle>
            <Stack spacing={{ xs: 1, sm: 1.5 }}>
              <Box><Typography sx={{ fontSize: { xs: "0.6rem", sm: "0.7rem" }, color: "#888", fontWeight: 500 }}>Date de naissance</Typography><Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem" }, color: "#333", fontWeight: 500 }}>17 octobre 2005</Typography></Box>
              <Box><Typography sx={{ fontSize: { xs: "0.6rem", sm: "0.7rem" }, color: "#888", fontWeight: 500 }}>Lieu</Typography><Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem" }, color: "#333", fontWeight: 500 }}>Ankofafa, Fianarantsoa</Typography></Box>
              <Box><Typography sx={{ fontSize: { xs: "0.6rem", sm: "0.7rem" }, color: "#888", fontWeight: 500 }}>Nationalite</Typography><Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem" }, color: "#333", fontWeight: 500 }}>Malgache</Typography></Box>
            </Stack>
          </SectionCard>

          <SectionCard>
            <SectionTitle>Langues</SectionTitle>
            <Stack spacing={{ xs: 1, sm: 1.5 }}>
              {[{ l: "Malagasy", lv: "Maternelle", w: "100%" }, { l: "Francais", lv: "DELF B2", w: "85%" }, { l: "Anglais", lv: "B2", w: "80%" }].map((x) => (
                <Box key={x.l}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem" }, color: "#333" }}>{x.l}</Typography>
                    <Typography sx={{ fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" }, color: "#0050FF", fontWeight: 600 }}>{x.lv}</Typography>
                  </Stack>
                  <Box sx={{ mt: 0.5, height: 3, bgcolor: "#e0e0e0", borderRadius: 2 }}><Box sx={{ width: x.w, height: 3, bgcolor: "#0050FF", borderRadius: 2 }} /></Box>
                </Box>
              ))}
            </Stack>
          </SectionCard>

          <SectionCard>
            <SectionTitle>Certificats</SectionTitle>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1.5} alignItems="center"><CheckCircle sx={{ fontSize: { xs: 14, sm: 16 }, color: "#0050FF" }} /><Typography sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem" }, color: "#333" }}>Certification PIX</Typography></Stack>
              <Stack direction="row" spacing={1.5} alignItems="center"><CheckCircle sx={{ fontSize: { xs: 14, sm: 16 }, color: "#0050FF" }} /><Typography sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem" }, color: "#333" }}>Certificat en Bureautique</Typography></Stack>
            </Stack>
          </SectionCard>
        </Stack>
      </Box>

      <Box sx={{ width: { xs: "100%", md: "50%" }, p: { xs: 2, sm: 3, md: 4 }, bgcolor: "#ffffff" }}>
        <Stack spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
          <SectionCard>
            <SectionTitle>Formation</SectionTitle>
            <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between"><Typography sx={{ fontWeight: 600, fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.95rem" }, color: "#1a1a2e" }}>Licence en Developpement d'Applications</Typography><Typography sx={{ fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" }, color: "#0050FF", fontWeight: 500 }}>2023 - Present</Typography></Stack>
              <Typography sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem" }, color: "#666" }}>3eme annee - EMIT, Universite de Fianarantsoa</Typography>
            </Box>
            <Box>
              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between"><Typography sx={{ fontWeight: 600, fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.95rem" }, color: "#1a1a2e" }}>Baccalaureat serie C</Typography><Typography sx={{ fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" }, color: "#0050FF", fontWeight: 500 }}>2023</Typography></Stack>
              <Typography sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem" }, color: "#666" }}>Lycee FMJ - Talatamaty, Fianarantsoa</Typography>
            </Box>
          </SectionCard>

          <SectionCard>
            <SectionTitle>Centres d'interet</SectionTitle>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {["Cinema", "Series", "Tele-realite", "Basket-ball", "Cuisine", "Sport"].map((item) => (
                <Box key={item} sx={{ bgcolor: "rgba(0,80,255,0.08)", color: "#0050FF", px: { xs: 1, sm: 1.5 }, py: { xs: 0.4, sm: 0.5, md: 0.6 }, borderRadius: 20, fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" }, fontWeight: 500 }}>{item}</Box>
              ))}
            </Box>
          </SectionCard>

          <SectionCard>
            <SectionTitle>Competences Techniques</SectionTitle>
            <Grid container spacing={{ xs: 1, sm: 1.5 }}>
              {[
                { t: "Frontend", items: ["React.js", "Vue.js", "Next.js", "TypeScript", "Tailwind CSS"] },
                { t: "Backend", items: ["PHP / Laravel", "Node.js", "Python", "NestJS"] },
                { t: "Base de donnees", items: ["MySQL", "PostgreSQL", "MongoDB"] },
                { t: "Outils", items: ["Git", "Figma", "Netlify", "Supabase"] },
              ].map((g) => (
                <Grid key={g.t} size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={0.5}>
                    <Typography sx={{ fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" }, fontWeight: 600, color: "#333" }}>{g.t}</Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.3 }}>
                      {g.items.map((s) => (
                        <Box key={s} sx={{ bgcolor: "rgba(0,80,255,0.08)", color: "#0050FF", px: { xs: 0.8, sm: 1, md: 1.2 }, py: { xs: 0.2, sm: 0.3, md: 0.4 }, borderRadius: 12, fontSize: { xs: "0.55rem", sm: "0.6rem", md: "0.65rem" }, fontWeight: 500 }}>{s}</Box>
                      ))}
                    </Box>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </SectionCard>
        </Stack>
      </Box>
    </Box>,

    // Page 2 - Projets et contact (panneaux type brochure)
    <Box key="page2" sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, minHeight: { xs: "auto", md: "80vh" }, height: "100%" }}>
      <Box sx={{ width: { xs: "100%", md: "50%" }, bgcolor: "#fafbff", p: { xs: 2, sm: 3, md: 4 }, borderRight: { xs: "none", md: "1px solid rgba(0,80,255,0.12)" } }}>
        <Stack spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
          <SectionCard>
            <SectionTitle>Projets</SectionTitle>
            <Grid container spacing={{ xs: 1, sm: 1.5 }}>
              {[
                { n: "UltimateChild", d: "Site vitrine educatif", t: ["HTML5", "CSS3", "JavaScript"] },
                { n: "Garage Pro", d: "Gestion de garage", t: ["HTML5", "CSS3", "JavaScript"] },
                { n: "Parent'Lien", d: "Plateforme parentale (Vue 3)", t: ["Vue 3", "Vite", "WebSocket"] },
                { n: "UrbanFlow IA", d: "Hackathon - mobilité urbaine IA", t: ["React", "Node.js", "Python"] },
              ].map((p) => (
                <Grid key={p.n} size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ bgcolor: "rgba(0,80,255,0.05)", border: "1px solid rgba(0,80,255,0.10)", p: { xs: 1.5, sm: 2 }, borderRadius: 2, height: "100%" }}>
                    <Typography sx={{ fontWeight: 600, fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem" }, color: "#1a1a2e" }}>{p.n}</Typography>
                    <Typography sx={{ fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" }, color: "#666" }}>{p.d}</Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.3, mt: 0.5 }}>
                      {p.t.map((t) => (
                        <Box key={t} sx={{ bgcolor: "rgba(0,80,255,0.08)", color: "#0050FF", px: { xs: 0.6, sm: 0.8, md: 1 }, py: { xs: 0.15, sm: 0.2, md: 0.3 }, borderRadius: 10, fontSize: { xs: "0.5rem", sm: "0.55rem", md: "0.6rem" } }}>{t}</Box>
                      ))}
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </SectionCard>

          <SectionCard>
            <SectionTitle>Experiences</SectionTitle>
            <Typography sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem" }, color: "#444", lineHeight: 1.6 }}>Participation a 2 Hackathons<br />Projets de groupe universitaires</Typography>
          </SectionCard>
        </Stack>
      </Box>

      <Box sx={{ width: { xs: "100%", md: "50%" }, p: { xs: 2, sm: 3, md: 4 }, bgcolor: "#ffffff", display: "flex", flexDirection: "column", justifyContent: "center", gap: { xs: 1.5, sm: 2, md: 2.5 } }}>
        <SectionCard>
          <SectionTitle>Contact</SectionTitle>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center"><Email sx={{ color: "#0050FF", fontSize: { xs: 20, sm: 24 } }} /><Box><Typography sx={{ fontSize: { xs: "0.6rem", sm: "0.65rem" }, color: "#888" }}>Email</Typography><Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem" }, color: "#333", fontWeight: 500 }}>luciarasoanirina8@gmail.com</Typography></Box></Stack>
            <Stack direction="row" spacing={2} alignItems="center"><Phone sx={{ color: "#0050FF", fontSize: { xs: 20, sm: 24 } }} /><Box><Typography sx={{ fontSize: { xs: "0.6rem", sm: "0.65rem" }, color: "#888" }}>Telephone</Typography><Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem" }, color: "#333", fontWeight: 500 }}>+261 38 702 36</Typography></Box></Stack>
            <Stack direction="row" spacing={2} alignItems="center"><LocationOn sx={{ color: "#0050FF", fontSize: { xs: 20, sm: 24 } }} /><Box><Typography sx={{ fontSize: { xs: "0.6rem", sm: "0.65rem" }, color: "#888" }}>Localisation</Typography><Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem" }, color: "#333", fontWeight: 500 }}>Fianarantsoa, Madagascar</Typography></Box></Stack>
          </Stack>
        </SectionCard>

        <SectionCard>
          <SectionTitle>Disponibilite</SectionTitle>
          <Box sx={{ display: "inline-block", bgcolor: "rgba(34,197,94,0.1)", color: "#22c55e", px: 2, py: 0.8, borderRadius: 30, fontWeight: 600, fontSize: { xs: "0.7rem", sm: "0.8rem" } }}>Disponible pour mission</Box>
        </SectionCard>
      </Box>
    </Box>,

    // Page 3 - Dos du livre (façon "À propos" + code-barres du modèle de couverture)
    <Box
      key="back"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: { xs: 1.5, md: 2 },
        height: "100%",
        minHeight: { xs: "70vh", md: "80vh" },
        p: { xs: 3, md: 4 },
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
              sx={{ color: "#0050FF", bgcolor: "rgba(0,80,255,0.08)", "&:hover": { bgcolor: "#0050FF", color: "#fff", transform: "translateY(-3px)" }, transition: "all 0.3s" }}
            >
              {s.icon}
            </IconButton>
          ))}
        </Stack>

        <Box sx={{ textAlign: "left", border: "1px solid rgba(0,80,255,0.12)", borderRadius: 2, p: { xs: 1.5, md: 2 }, mb: 2, bgcolor: "#fafbff" }}>
          <Typography sx={{ fontSize: "0.62rem", fontWeight: 700, color: "#0050FF", letterSpacing: 2, mb: 1, textAlign: "center" }}>
            À PROPOS
          </Typography>
          <Typography sx={{ fontSize: { xs: "0.68rem", md: "0.75rem" }, color: "#444", lineHeight: 1.7, textAlign: "center" }}>
            Developpeuse Full-Stack basee a Fianarantsoa, Madagascar, actuellement en 3eme annee de Licence a l'EMIT. Disponible pour des missions freelance ou des collaborations.
          </Typography>
        </Box>

        <Stack spacing={0.5} sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <Email sx={{ color: "#0050FF", fontSize: 18 }} />
            <Typography sx={{ fontSize: { xs: "0.72rem", md: "0.8rem" }, color: "#333" }}>luciarasoanirina8@gmail.com</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <Phone sx={{ color: "#0050FF", fontSize: 18 }} />
            <Typography sx={{ fontSize: { xs: "0.72rem", md: "0.8rem" }, color: "#333" }}>+261 38 702 36</Typography>
          </Stack>
        </Stack>

        <Box
          sx={{
            display: "inline-flex",
            p: 1.5,
            bgcolor: "#fff",
            borderRadius: 3,
            border: "2px solid rgba(0,80,255,0.15)",
            boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
          }}
        >
          {qrUrl ? (
            <Box component="img" src={qrUrl} alt="QR code CV" sx={{ width: { xs: 118, md: 144 }, height: { xs: 118, md: 144 }, display: "block" }} />
          ) : (
            <Box sx={{ width: { xs: 118, md: 144 }, height: { xs: 118, md: 144 } }} />
          )}
        </Box>
        <Typography sx={{ mt: 1, fontSize: "0.66rem", color: "#888", letterSpacing: 0.5 }}>
          Scannez pour télécharger mon CV
        </Typography>

        {/* BOUTON DE TELECHARGEMENT - Avec z-index élevé pour être cliquable */}
        <Box
          sx={{
            mt: 2.5,
            position: "relative",
            zIndex: 100,
            pointerEvents: "auto",
          }}
        >
          <Button
            type="button"
            variant="contained"
            startIcon={<Download />}
            onClick={handleDownloadPDF}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.04)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
            sx={{
              bgcolor: "#0050FF",
              borderRadius: 30,
              px: 4,
              py: 1.2,
              fontWeight: 700,
              textTransform: "none",
              cursor: "pointer",
              boxShadow: "0 10px 24px rgba(0,80,255,0.3)",
              "&:hover": {
                bgcolor: "#003bb5",
                transform: "scale(1.04)",
              },
              "&:active": {
                transform: "scale(0.96)",
              },
              transition: "all 0.3s",
              pointerEvents: "auto",
              position: "relative",
              zIndex: 101,
            }}
          >
            Télécharger le CV
          </Button>
        </Box>

        {/* Bande "code-barres" décorative façon dos de livre du modèle 1 */}
        <BarcodeStripe />
      </Box>
    </Box>,
  ];

  const basePage = flip ? flip.to : currentPage;
  const frontPage = flip ? (flip.dir === "next" ? flip.from : flip.to) : currentPage;
  const backPage = flip ? (flip.dir === "next" ? flip.to : flip.from) : currentPage;

  const canPrev = currentPage > 0 && !flip;
  const canNext = currentPage < pages.length - 1 && !flip;

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
        perspective: "2600px",
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
          transformStyle: "preserve-3d",
          animation: "cvBookIn 0.7s cubic-bezier(0.2, 0.9, 0.3, 1.2)",
        }}
      >
        <Box sx={{ position: "absolute", top: -10, right: -10, zIndex: 30, bgcolor: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", borderRadius: "50%", p: 0.5, "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}>
          <IconButton onClick={onClose} sx={{ color: "#fff", "&:hover": { transform: "rotate(90deg)" }, transition: "transform 0.3s ease" }}><Close /></IconButton>
        </Box>

        <Box
          sx={{
            width: "100%",
            height: "100%",
            position: "relative",
            transformStyle: "preserve-3d",
            transform: { md: "rotateX(6deg)" },
            transition: "transform 0.6s ease",
          }}
        >
          <Box sx={{ position: "absolute", inset: 0, borderRadius: { xs: 2, md: 3 }, transform: "translateZ(-26px)", bgcolor: "#e8e2da", boxShadow: "0 40px 90px rgba(0,0,0,0.65)" }} />
          {[22, 18, 14, 10, 6].map((z, i) => (
            <Box key={z} sx={{ position: "absolute", top: i + 1, bottom: i + 1, right: -3 - i, width: 8, borderRadius: 1, transform: `translateZ(-${z}px)`, bgcolor: i % 2 ? "#fbf9f6" : "#eef0f3", display: { xs: "none", md: "block" } }} />
          ))}

          {/* Tranche du livre, toujours visible (cf. modèle avec dos illustré) */}
          <BookSpine />

          <Box
            sx={{
              position: "absolute",
              inset: 0,
              bgcolor: "#ffffff",
              borderRadius: { xs: 2, md: 3 },
              overflow: "hidden",
              boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
            }}
          >
            <PageScroller>{pages[basePage]}</PageScroller>
          </Box>

          <Box sx={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 28, transform: "translateX(-50%)", zIndex: 6, display: { xs: "none", md: "block" }, background: "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.12) 45%, rgba(0,0,0,0.18) 50%, rgba(0,0,0,0.12) 55%, rgba(0,0,0,0) 100%)", pointerEvents: "none" }} />

          {canPrev && (
            <Box
              onClick={prevPage}
              title="Page précédente"
              sx={{
                position: "absolute", top: 0, bottom: 0, left: 0,
                width: { xs: "15%", md: "12%" },
                zIndex: 9, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "flex-start", pl: 1,
                color: "rgba(0,80,255,0)",
                transition: "all 0.3s",
                "&:hover": { color: "rgba(0,80,255,0.7)", background: "linear-gradient(90deg, rgba(0,80,255,0.08), rgba(0,80,255,0))" },
              }}
            >
              <NavigateBefore sx={{ fontSize: { xs: 30, md: 44 } }} />
            </Box>
          )}
          {canNext && (
            <Box
              onClick={nextPage}
              title="Page suivante"
              sx={{
                position: "absolute", top: 0, bottom: 0, right: 0,
                width: { xs: "15%", md: "12%" },
                zIndex: 9, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "flex-end", pr: 1,
                color: "rgba(0,80,255,0)",
                transition: "all 0.3s",
                "&:hover": { color: "rgba(0,80,255,0.7)", background: "linear-gradient(270deg, rgba(0,80,255,0.08), rgba(0,80,255,0))" },
              }}
            >
              <NavigateNext sx={{ fontSize: { xs: 30, md: 44 } }} />
            </Box>
          )}

          {flip && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                transformStyle: "preserve-3d",
                transformOrigin: "left center",
                zIndex: 12,
                animation: `${flip.dir === "next" ? "cvFlipNext" : "cvFlipPrev"} ${FLIP_MS}ms cubic-bezier(0.4, 0, 0.2, 1) forwards`,
                "&::after": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  borderRadius: { xs: 2, md: 3 },
                  pointerEvents: "none",
                  background: "linear-gradient(90deg, rgba(0,0,0,0.35), rgba(0,0,0,0) 35%)",
                  animation: `cvFlipShade ${FLIP_MS}ms ease forwards`,
                },
              }}
            >
              <Box sx={{ position: "absolute", inset: 0, bgcolor: "#fff", borderRadius: { xs: 2, md: 3 }, overflow: "hidden", backfaceVisibility: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
                <PageScroller>{pages[frontPage]}</PageScroller>
              </Box>
              <Box sx={{ position: "absolute", inset: 0, bgcolor: "#fff", borderRadius: { xs: 2, md: 3 }, overflow: "hidden", backfaceVisibility: "hidden", transform: "rotateY(180deg)", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
                <PageScroller>{pages[backPage]}</PageScroller>
              </Box>
            </Box>
          )}
        </Box>

        <Box sx={{ position: "absolute", bottom: -20, left: 0, right: 0, display: "flex", justifyContent: "space-between", alignItems: "center", px: { xs: 1, sm: 2 }, py: 1, zIndex: 20, flexWrap: "wrap", gap: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: { xs: "0.6rem", sm: "0.7rem" } }}>Lucia Rasoanirina</Typography>
            <Box sx={{ width: 1, height: 16, bgcolor: "rgba(255,255,255,0.2)" }} />
            <Typography sx={{ color: "rgba(255,255,255,0.3)", fontSize: { xs: "0.5rem", sm: "0.6rem" } }}>{currentPage + 1} / {pages.length}</Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton onClick={prevPage} disabled={currentPage === 0 || !!flip} sx={{ color: currentPage === 0 ? "rgba(255,255,255,0.2)" : "#fff", "&:hover": { bgcolor: "rgba(255,255,255,0.1)" }, transition: "all 0.3s" }}><NavigateBefore /></IconButton>
            <IconButton onClick={nextPage} disabled={currentPage === pages.length - 1 || !!flip} sx={{ color: currentPage === pages.length - 1 ? "rgba(255,255,255,0.2)" : "#fff", "&:hover": { bgcolor: "rgba(255,255,255,0.1)" }, transition: "all 0.3s" }}><NavigateNext /></IconButton>
          </Stack>
        </Box>
      </Box>

      <style>{`
        @keyframes cvFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes cvBookIn { from { opacity: 0; transform: translateY(40px) rotateX(25deg) scale(0.9); } to { opacity: 1; transform: translateY(0) rotateX(0) scale(1); } }
        @keyframes cvFlipNext { from { transform: rotateY(0deg); } to { transform: rotateY(-180deg); } }
        @keyframes cvFlipPrev { from { transform: rotateY(-180deg); } to { transform: rotateY(0deg); } }
        @keyframes cvFlipShade { 0% { opacity: 0; } 45% { opacity: 1; } 100% { opacity: 0; } }
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
