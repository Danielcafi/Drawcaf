# Drawcaf - Product Requirements Document (PRD)

## Vision du Produit

**Drawcaf** est une plateforme e-commerce open-source permettant aux entrepreneurs et entreprises de créer, gérer et développer leur boutique en ligne. Le site actuel est une landing page marketing destinée à convertir les visiteurs en utilisateurs.

---

## MVP - Fonctionnalités à Implémenter

### 1. Authentification & Onboarding

| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Inscription email/mot de passe | Créer un compte utilisateur | 🔴 Haute |
| Connexion social (Google, GitHub) | Authentification OAuth | 🔴 Haute |
| Mot de passe oublié | Récupération par email | 🟡 Moyenne |
| Onboarding wizard | Guide de configuration du magasin | 🟡 Moyenne |
| Vérification email | Confirmation par lien | 🟡 Moyenne |

**User Stories:**
- En tant qu'utilisateur, je veux m'inscrire en 1 clic avec Google
- En tant qu'utilisateur, je veux un guide étape par étape pour configurer ma boutique

---

### 2. Dashboard Admin

| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Vue d'ensemble | Statistiques ventes, visiteurs, revenus | 🔴 Haute |
| Gestion des produits | CRUD produits avec images | 🔴 Haute |
| Gestion des commandes | Liste, détails, statuts | 🔴 Haute |
| Gestion des clients | Liste clients, historique | 🟡 Moyenne |
| Paramètres du magasin | Nom, logo, devise, langue | 🔴 Haute |
| Analytics | Graphiques de performance | 🟡 Moyenne |

**User Stories:**
- En tant que marchand, je veux voir mes ventes du jour en un coup d'œil
- En tant que marchand, je veux ajouter un produit en moins de 2 minutes

---

### 3. Gestion des Produits

| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Ajouter/Modifier/Supprimer | CRUD complet | 🔴 Haute |
| Upload d'images multiples | Galerie produit | 🔴 Haute |
| Variantes (taille, couleur) | Options configurables | 🔴 Haute |
| Inventaire | Gestion du stock | 🔴 Haute |
| Catégories & Tags | Organisation | 🟡 Moyenne |
| Import/Export CSV | Migration de données | 🟢 Basse |
| Produits numériques | Téléchargements | 🟢 Basse |

**User Stories:**
- En tant que marchand, je veux ajouter 10 produits via un fichier CSV
- En tant que marchand, je veux gérer les variantes de chaque produit

---

### 4. Boutique Client (Storefront)

| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Page d'accueil | Design personnalisable | 🔴 Haute |
| Catalogue produits | Liste avec filtres | 🔴 Haute |
| Page produit | Détails, galerie, avis | 🔴 Haute |
| Panier | Ajout, modification, suppression | 🔴 Haute |
| Recherche | Recherche produit | 🟡 Moyenne |
| WishList | Liste de souhaits | 🟢 Basse |
| Multi-langue | Internationalisation | 🟢 Basse |
| Multi-devises | Devise locale | 🟡 Moyenne |

**User Stories:**
- En tant que client, je veux filtrer les produits par prix et catégorie
- En tant que client, je veux sauvegarder mes produits favoris

---

### 5. Paiement & Checkout

| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Stripe Integration | Paiement carte bancaire | 🔴 Haute |
| PayPal Integration | Paiement PayPal | 🔴 Haute |
| Page de checkout | Formulaire sécurisé | 🔴 Haute |
| Factures | Génération automatique PDF | 🔴 Haute |
| Remises & Coupons | Codes promo | 🟡 Moyenne |
| Abonnements | Paiements récurrents | 🟢 Basse |
| Apple Pay / Google Pay | Paiement mobile | 🟡 Moyenne |

**User Stories:**
- En tant que client, je veux payer en 1 clic avec Apple Pay
- En tant que marchand, je veux créer un code promo de -20%

---

### 6. Expédition & Livraison

| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Zones de livraison | Configuration par zone | 🔴 Haute |
| Tarifs fixes | Frais de port fixes | 🔴 Haute |
| Suivi colis | Tracking automatique | 🟡 Moyenne |
| Livraison gratuite | Seuil minimum | 🟡 Moyenne |
| Dropshipping | Intégration fournisseurs | 🟢 Basse |

**User Stories:**
- En tant que client, je veux suivre ma commande en temps réel
- En tant que marchand, je veux offrir la livraison gratuite au-dessus de 50€

---

### 7. Notifications & Communication

| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Email transactionnel | Confirmation commande | 🔴 Haute |
| Email marketing | Newsletters | 🟡 Moyenne |
| Notifications push | Alertes ventes | 🟢 Basse |
| Chat support | Messagerie en direct | 🟢 Basse |
| SMS notifications | Alertes importantes | 🟢 Basse |

**User Stories:**
- En tant que client, je veux recevoir un email de confirmation immédiat
- En tant que marchand, je veux être notifié de chaque nouvelle commande

---

## Fonctionnalités Futures (Post-MVP)

### Phase 2 - Croissance

| Fonctionnalité | Description | Impact |
|----------------|-------------|--------|
| Marketplace | Multi-vendeurs | Élevé |
| Mobile App (React Native) | Application iOS/Android | Élevé |
| IA de recommandation | Produits suggérés | Élevé |
| Programmes de fidélité | Points & récompenses | Moyen |
| A/B Testing | Optimisation conversion | Moyen |
| API GraphQL | Intégrations avancées | Moyen |

### Phase 3 - Expansion

| Fonctionnalité | Description | Impact |
|----------------|-------------|--------|
| Multi-tenant SaaS | Plusieurs magasins/compte | Élevé |
| Intégration comptable | QuickBooks, FreshBooks | Moyen |
| Dropshipping intégré | AliExpress, Oberlo | Élevé |
| Chat IA support | Support automatisé | Moyen |
| Analytics avancés | Prédictions IA | Moyen |
| White-label | Solution blanche | Élevé |

### Phase 4 - Écosystème

| Fonctionnalité | Description | Impact |
|----------------|-------------|--------|
| Marketplace de thèmes | Templates premium | Élevé |
| Marketplace d'apps | Extensions tierces | Élevé |
| API publique | Développeurs tiers | Élevé |
| Programmes d'affiliation | Partenaires | Moyen |
| Formation en ligne | Cours e-commerce | Moyen |

---

## Stack Technique Recommandée

### Frontend (Actuel)
- React + Vite
- Tailwind CSS
- Framer Motion

### Backend (À créer)
- **API:** Node.js + Express / ou Next.js API Routes
- **Base de données:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth.js / Clerk
- **Paiement:** Stripe SDK
- **Stockage images:** Cloudinary / AWS S3
- **Email:** Resend / SendGrid
- **Déploiement:** Vercel + PlanetScale

---

## Acquisition d'Acheteurs (Buyer Acquisition)

### Stratégie d'Attraction

Pour attirer les acheteurs sur la plateforme, Drawcaf doit résoudre le problème de l'œuf et de la poule : les marchands veulent des acheteurs, les acheteurs veulent du contenu.

#### Phase 1 - Seed (Mois 1-3)

| Stratégie | Description | Objectif |
|-----------|-------------|----------|
| SEO & Content Marketing | Articles de blog sur le e-commerce | 10K visiteurs/mois |
| Social Media (Instagram, TikTok) | Contenu visuel produits tendance | 5K followers |
| Programmes d'affiliation | Commission par vente pour les partenaires | 50 affiliés |
| Marketplaces existantes | Intégration Etsy, Amazon comme source | 100 produits listés |

#### Phase 2 - Growth (Mois 4-6)

| Stratégie | Description | Objectif |
|-----------|-------------|----------|
| Google Shopping Ads | Publicités produits ciblées | 1K clics/jour |
| Facebook/Instagram Ads | Retargeting visiteurs | 2% taux conversion |
| Email Marketing | Newsletters produits tendance | 10K inscrits |
| Influence Marketing | Collaborations micro-influenceurs | 20 collabs/mois |
| Referral Program | Parrainage clients (crédit offert) | 1K parrainages/mois |

#### Phase 3 - Scale (Mois 7-12)

| Stratégie | Description | Objectif |
|-----------|-------------|----------|
| Marketplace Hub | Regroupement de boutiques par catégorie | 500 boutiques |
| Livraison gratuite offerte | Subventionned by Drawcaf | +30% conversions |
| Fidélité & Gamification | Points, badges, récompenses | 40% rétention |
| App Mobile | Push notifications promotions | 20K téléchargements |
| SEO Avancé | Pages catégories optimisées | 50K visiteurs/mois |

---

### Features d'Acquisition Acheteurs (À développer)

#### 1. Découverte & Navigation

| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Page d'accueil personnalisée | Recommandations basées sur l'historique | 🔴 Haute |
| Catégories trending | Produits tendance du moment | 🔴 Haute |
| Recherche avancée | Filtres prix, note, localisation | 🔴 Haute |
| Collections thématiques | "Noël", "Été", "Tech" | 🟡 Moyenne |
| Produits vus récemment | Historique de navigation | 🟡 Moyenne |
| Similar Products | "Vous aimerez aussi" | 🟡 Moyenne |

#### 2. Social Proof & Confiance

| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Avis vérifiés | Système de notation 5 étoiles | 🔴 Haute |
| Photos clients | UGC (User Generated Content) | 🔴 Haute |
| Nombre de ventes affiché | "123 vendus" | 🔴 Haute |
| Badge vendeur fiable | Certification marchand | 🟡 Moyenne |
| Livraison vérifiée | Confirmation de réception | 🟡 Moyenne |

#### 3. Engagement & Rétention

| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| WishList | Sauvegarder pour plus tard | 🔴 Haute |
| Alertes prix | Notification baisse de prix | 🟡 Moyenne |
| Programmes de fidélité | Points échangeables | 🟡 Moyenne |
| Coupons personnalisés | Offres ciblées | 🔴 Haute |
| Flash Sales | Ventes flash limitées | 🟡 Moyenne |
| Gamification | Badges, niveaux, récompenses | 🟢 Basse |

#### 4. Communication & Support

| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Chat avec vendeur | Messagerie directe | 🔴 Haute |
| Notifications push | Nouveaux produits, promotions | 🟡 Moyenne |
| Email transactionnel | Suivi commande | 🔴 Haute |
| FAQ intégrée | Questions fréquentes | 🟡 Moyenne |
| Support chat en direct | Service client | 🟢 Basse |

---

### KPIs d'Acquisition Acheteurs

| Métrique | Objectif M3 | Objectif M6 | Objectif M12 |
|----------|-------------|-------------|--------------|
| Visiteurs uniques/mois | 10K | 50K | 200K |
| Taux de conversion visiteur → achat | 1% | 2% | 3% |
| Panier moyen | 30€ | 45€ | 60€ |
| Taux de rétention (30j) | 15% | 25% | 40% |
| Reviews moyennes | 4.2/5 | 4.5/5 | 4.7/5 |
| Temps moyen sur site | 2min | 4min | 6min |
| Pages vues/visite | 3 | 5 | 8 |

---

### Budget Marketing Estimé

| Poste | M1-3 | M4-6 | M7-12 |
|-------|------|------|-------|
| Content & SEO | 500€ | 1000€ | 2000€ |
| Social Media Ads | 1000€ | 3000€ | 8000€ |
| Google Ads | 500€ | 2000€ | 5000€ |
| Influence Marketing | 500€ | 2000€ | 5000€ |
| Affiliation | 0€ | 1000€ | 3000€ |
| **Total** | **2500€** | **9000€** | **23000€** |

---

## Métriques de Succès MVP

| Métrique | Objectif |
|----------|----------|
| Temps de création boutique | < 5 minutes |
| Taux de conversion landing → inscription | > 5% |
| Temps de chargement page | < 2 secondes |
| Taux de satisfaction utilisateur | > 4/5 |
| Nombre de marchands actifs (M1) | 100+ |

---

## Roadmap Estimée

| Phase | Durée | Livrables |
|-------|-------|-----------|
| MVP - Sprint 1-2 | 4 semaines | Auth + Dashboard basique |
| MVP - Sprint 3-4 | 4 semaines | Produits + Boutique |
| MVP - Sprint 5-6 | 4 semaines | Paiement + Checkout |
| MVP - Sprint 7-8 | 4 semaines | Expédition + Notifications |
| **Lancement MVP** | **Semaine 16** | **v1.0** |
| Phase 2 | Mois 5-8 | Marketplace + Mobile |
| Phase 3 | Mois 9-12 | Expansion + API |
| Phase 4 | Année 2 | Écosystème complet |

---

*Dernière mise à jour: 18 Septembre 2026*
