# Portfolio - Lucia Rasoanirina

Portfolio personnel presentant mon parcours, mes competences et mes projets en tant que developpeuse Full-Stack.

## Technologies utilisees

- React 18
- TypeScript
- Material UI
- EmailJS
- React Icons

## Installation

```bash
git clone <url-du-depot>
npm install
npm run dev


##Structure du projet

public/
├── # Toutes les images des projects dans le portfolio
src/
----assets/
├── components/
│   └── Accueil.tsx     # Composant principal
├── App.tsx
└── main.tsx


## Listes des Sections existants dans le portfolio


About : Presentation personnelle

Knowledge : Connaissances techniques acquises au cours de mes années d'études

Skills : Competences avec barres de progression

Projects : Projets personnels

Contact : Formulaire de contact


## Mes Contact


Email : luciarasoanirina8@gmail.com

Téléphone : +261 38 39 702 36

GitHub : https://github.com/Lucia-RASOANIRINA



##Licence
MIT

## LISTE COMPLETE DES IMPORTS

```tsx
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
  Twitter,
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
} from "@mui/icons-material";
import React, { useState, useEffect, useRef } from "react";
import { FaDatabase, FaPython, FaReact, FaJava, FaHtml5, FaCss3Alt, FaLaravel, FaVuejs, FaNodeJs, FaJs, FaFigma } from "react-icons/fa";
import { SiTypescript, SiVite, SiExpress, SiMongodb, SiTailwindcss, SiRedux, SiNextdotjs, SiNestjs, SiFlutter, SiSupabase, SiNetlify } from "react-icons/si";
import emailjs from '@emailjs/browser';
LISTE DES DEPENDANCES PACKAGE.JSON
json
{
  "dependencies": {
    "@emotion/react": "^11.11.1",
    "@emotion/styled": "^11.11.0",
    "@mui/icons-material": "^5.14.0",
    "@mui/material": "^5.14.0",
    "@emailjs/browser": "^3.11.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-icons": "^4.11.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^4.4.0"
  }
}

COMMANDES UTILES
bash
# Installation des dependances
npm install

# Demarrage en mode developpement
npm run dev

# Build pour la production
npm run build

# Preview du build
npm run preview

# Linter
npm run lint
