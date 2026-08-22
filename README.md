# Abricot 🍑📋

## 📌 Contexte
Abricot est une application SaaS de gestion de projets collaboratifs développée dans le cadre de ma formation **OpenClassrooms**. Le projet consiste à créer une application **Next.js** permettant de gérer des projets, des tâches et des commentaires en équipe, avec une authentification sécurisée et une interface accessible, en s'appuyant sur une API backend fournie (Express / Prisma).

## ✨ Fonctionnalités
- Authentification (login / logout) avec sessions via cookies `httpOnly` et JWT
- Gestion de projets (création, consultation, mise à jour)
- Gestion de tâches
- Système de commentaires
- Mise à jour du profil utilisateur
- Recherche et navigation contextuelle
- Interface accessible, conforme aux exigences **WCAG** (audits WAVE)
- Compatibilité mobile

## 📦 Dépendances principales
- **Next.js** (App Router, Server Components & Server Actions)
- **React** + **JSX**
- **CSS Modules** (approche desktop-first avec breakpoints `max-width`)
- **Node.js / Express + Prisma** (backend fourni, non modifiable)

## 🏗️ Architecture
- **Server Actions** utilisées comme pont vers l'API backend
- **Server Components** pour le fetch de données
- **React Contexts** pour l'état client : `AuthContext`, `ProjectContext`, `TaskContext`, `CommentContext`, `DashboardContext`
- Layout `(protected)` préchargeant les données utilisateur et projet côté serveur

## 🚀 Installation
Le site est dépendant de l'API backend fournie par OpenClassrooms.
https://github.com/OpenClassrooms-Student-Center/dev-react-P10

```bash
git clone https://github.com/<ton-utilisateur>/abricot.git
cd abricot
npm install
npm run dev
```