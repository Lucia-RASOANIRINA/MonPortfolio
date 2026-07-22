# Portfolio - Lucia Rasoanirina

Portfolio personnel présentant mon parcours, mes compétences et mes projets en tant que développeuse Full-Stack.

![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-4.4-646CFF?logo=vite)
![Material UI](https://img.shields.io/badge/MUI-5.14-007FFF?logo=mui)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

---

## Table des matières

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Installation](#installation)
- [Structure du projet](#structure-du-projet)
- [Sections du portfolio](#sections-du-portfolio)
- [Configuration EmailJS](#configuration-emailjs)
- [Commandes disponibles](#commandes-disponibles)
- [Contact](#contact)
- [Licence](#licence)

---

## Aperçu

Ce portfolio présente mon identité professionnelle en tant que développeuse Full-Stack. Il met en avant :

- Mon parcours académique et mes connaissances techniques
- Mes compétences avec des indicateurs visuels de progression
- Une sélection de projets personnels et collaboratifs
- Un formulaire de contact fonctionnel via EmailJS

**Lien du site** : [https://lucia-rasoanirina.netlify.app](https://lucia-rasoanirina.netlify.app)

---

## Fonctionnalités

- Performance optimale : Build rapide grâce à Vite
- Design moderne : Interface utilisateur avec Material UI
- Responsive : Adapté à tous les écrans (mobile, tablette, desktop)
- Multilingue : Support français et anglais (bascule disponible)
- Formulaire de contact : Envoi d'emails via EmailJS
- Galerie d'images : Visualisation des projets en plein écran
- Navigation fluide : Scroll smooth et menu sticky
- Animations 3D : Effets visuels immersifs (scroll reveal, parallax)

---

## Technologies utilisées

### Frontend

| Technologie | Version | Utilisation |
|-------------|---------|-------------|
| React | 18.2 | Framework UI |
| TypeScript | 5.0 | Typage statique |
| Vite | 4.4 | Bundler & serveur de développement |
| Material UI | 5.14 | Bibliothèque de composants |
| Material Icons | 5.14 | Icônes Material Design |
| React Icons | 4.11 | Icônes additionnelles |

### Services & Intégration

| Service | Utilisation |
|---------|-------------|
| EmailJS | Envoi de formulaires de contact |
| Netlify | Hébergement & déploiement continu |

### Dépendances de développement

```json
{
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^4.4.0"
  }
}

/*/*Installation
***Prérequis
Node.js (version 18 ou supérieure)

npm ou yarn

/*/*Étapes d'installation
bash
# 1. Cloner le dépôt
git clone https://github.com/Lucia-RASOANIRINA/MonPortfolio.git

# 2. Accéder au dossier du projet
cd MonPortfolio

# 3. Installer les dépendances
npm install

# 4. Démarrer le serveur de développement
npm run dev
L'application sera disponible sur http://localhost:5173.

Déploiement en production
bash
# Build pour la production
npm run build

# Prévisualiser le build
npm run preview
Structure du projet
text
MonPortfolio/
├── public/
│   ├── photo-lucia.jpg              # Photo de profil
│   ├── CentreEducation_*.png        # Images projet UltimateChild
│   ├── ouratable_*.png              # Images projet OuraTable
│   ├── garageJSlocalStorage_*.png   # Images projet Garage Pro
│   ├── PokectLoveDestiny.png        # Image projet Packet Love Destiny
│   ├── parentia_*.png               # Images projet Parent'Lien
│   ├── portfolio_*.png              # Images projet Portfolio
│   └── feedbackPro_*.jpg            # Images projet FeedbackPro
│
├── src/
│   ├── components/
│   │   ├── Accueil.tsx              # Composant principal
│   │   └── CvLivre.tsx              # Visualisation du CV
│   ├── App.tsx                      # Point d'entrée React
│   ├── main.tsx                     # Rendu ReactDOM
│   └── index.css                    # Styles globaux
│
├── .env                             # Variables d'environnement (EmailJS)
├── .gitignore                       # Fichiers ignorés par Git
├── index.html                       # Template HTML
├── package.json                     # Dépendances & scripts
├── tsconfig.json                    # Configuration TypeScript
├── tsconfig.node.json               # Configuration TypeScript pour Node
├── vite.config.ts                   # Configuration Vite
└── README.md                        # Documentation du projet
Sections du portfolio
Section	Description
About	Présentation personnelle, photo de profil et statut professionnel
Knowledge	Connaissances techniques acquises durant mes études et projets personnels, organisées par catégories
Skills	Compétences techniques avec barres de progression animées
Projects	Portfolio de projets avec galerie d'images, liens GitHub et démos
Contact	Formulaire de contact avec validation en temps réel et intégration EmailJS
Configuration EmailJS
Le formulaire de contact utilise EmailJS pour l'envoi d'emails. Pour le configurer :

Créez un compte sur EmailJS

Créez un service email (Gmail, Outlook, etc.)

Créez un template d'email personnalisé

Récupérez vos identifiants dans le tableau de bord

Créez un fichier .env à la racine du projet :

.env
# EmailJS Configuration
VITE_EMAILJS_PUBLIC_KEY=votre_cle_publique_ici
VITE_EMAILJS_SERVICE_ID=votre_service_id_ici
VITE_EMAILJS_TEMPLATE_ID=votre_template_id_ici
Important : Ajoutez toujours .env dans votre .gitignore pour ne pas exposer vos identifiants publiquement.

Commandes disponibles
Commande	Description
npm install	Installe toutes les dépendances
npm run dev	Lance le serveur de développement
npm run build	Compile l'application pour la production
npm run preview	Prévisualise le build de production
Contact
Moyen	Informations
Email	luciarasoanirina8@gmail.com
Téléphone	+261 38 39 702 36
LinkedIn	Lucia RASOANIRINA
GitHub	Lucia-RASOANIRINA
Instagram	@rasoanirinambolatiana
Facebook	Maria Lucia
Licence
Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails.

Remerciements
Material UI pour leur excellente bibliothèque de composants

EmailJS pour la solution d'envoi d'emails

Vite pour l'outillage de développement moderne

Auteur
Lucia RASOANIRINA
Full-Stack Developer

