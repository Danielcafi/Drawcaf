# Drawcaf - Product Requirements Document (PRD)

## Vision du Produit

**Drawcaf** est une marketplace e-commerce open-source à deux côtés :
- **Vendeurs** : Créent leur boutique et mettent leurs produits en vente
- **Acheteurs** : Viennent acheter en toute confiance

**Principe fondamental** : Inspirer confiance à chaque étape du parcours.

---

## Les Deux Acteurs Principaux

```
┌─────────────────────────────────────────────────────────────┐
│                        DRAWCAF                              │
├─────────────────────┬───────────────────────────────────────┤
│      VENDEUR        │             ACHETEUR                  │
├─────────────────────┼───────────────────────────────────────┤
│ • Crée sa boutique  │ • Parcourt les produits              │
│ • Ajoute ses        │ • Compare les prix                   │
│   produits          │ • Lit les avis                       │
│ • Fixe les prix     │ • Achète en sécurité                 │
│ • Gère les commandes│ • Reçoit à domicile                  │
│ • Reçoit le paiement│ • Pose des questions au vendeur      │
│ • Construit sa      │ • Laisse des avis                    │
│   réputation        │ • Revient acheter                     │
└─────────────────────┴───────────────────────────────────────┘
```

---

## MVP - VENDEUR

### 1. Inscription Vendeur

| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Création compte | Email + mot de passe | 🔴 Haute |
| Connexion Google/Apple | Auth social en 1 clic | 🔴 Haute |
| Profil vendeur | Nom, photo, bio, localisation | 🔴 Haute |
| Vérification identité | Pièce d'identité pour badge "Vérifié" | 🟡 Moyenne |
| Acceptation CGU | Conditions générales d'utilisation | 🔴 Haute |

**User Story :** *En tant que vendeur, je veux créer mon compte en moins de 2 minutes.*

---

### 2. Création de Boutique

| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Nom de la boutique | Titre unique | 🔴 Haute |
| Logo boutique | Upload image | 🔴 Haute |
| Description | Texte de présentation | 🔴 Haute |
| Banner | Image de couverture | 🟡 Moyenne |
| Catégorie d'activité | Mode, Tech, Maison, etc. | 🔴 Haute |
| Localisation | Ville, Pays | 🔴 Haute |
| Politique de retour | Conditions de remboursement | 🔴 Haute |
| Délai de traitement | Temps de préparation | 🔴 Haute |

**User Story :** *En tant que vendeur, je veux personnaliser ma boutique pour refléter ma marque.*

---

### 3. Gestion des Produits

| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Ajouter un produit | Titre, description, prix | 🔴 Haute |
| Photos multiples | Jusqu'à 10 images par produit | 🔴 Haute |
| Variantes | Taille, couleur, matière | 🔴 Haute |
| Prix | Prix de base + prix variantes | 🔴 Haute |
| Inventaire | Quantité en stock | 🔴 Haute |
| Poids/Dimensions | Pour calcul livraison | 🔴 Haute |
| Catégorie produit | Organisation | 🔴 Haute |
| Tags | Mots-clés pour recherche | 🟡 Moyenne |
| Produit numérique | Fichiers téléchargeables | 🟢 Basse |
| Brouillon | Sauvegarder sans publier | 🟡 Moyenne |

**User Story :** *En tant que vendeur, je veux ajouter un produit avec 5 photos en moins de 3 minutes.*

---

### 4. Dashboard Vendeur

| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Vue d'ensemble | Ventes du jour/semaine/mois | 🔴 Haute |
| Commandes récentes | Liste avec statuts | 🔴 Haute |
| Revenus | Chiffre d'affaires | 🔴 Haute |
| Produits populaires | Top ventes | 🟡 Moyenne |
| Messages clients | Répondre aux questions | 🟡 Moyenne |
| Avis reçus | Notes et commentaires | 🔴 Haute |
| Paramètres | Boutique, paiement, livraison | 🔴 Haute |

**User Story :** *En tant que vendeur, je veux voir mes ventes du jour en un coup d'œil.*

---

### 5. Gestion des Commandes

| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Liste des commandes | Filtrer par statut | 🔴 Haute |
| Détail commande | Produits, client, montant | 🔴 Haute |
| Changer le statut | En préparation → Expédié → Livré | 🔴 Haute |
| Ajouter un numéro de suivi | Tracking colis | 🔴 Haute |
| Imprimer bordereau | Étiquette d'expédition | 🟡 Moyenne |
| Remboursement | Rembourser une commande | 🔴 Haute |

**User Story :** *En tant que vendeur, je veux mettre à jour le statut d'une commande en 1 clic.*

---

### 6. Paiements Vendeur

| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Connect Stripe | Compte Stripe connecté | 🔴 Haute |
| Versement automatique | Paiement sous 7 jours | 🔴 Haute |
| Historique paiements | Revenus par période | 🔴 Haute |
| Factures | Télécharger factures | 🟡 Moyenne |
| Commission plateforme | 5% par transaction | 🔴 Haute |

**User Story :** *En tant que vendeur, je veux recevoir mon paiement automatiquement chaque semaine.*

---

### 7. Réputation Vendeur

| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Badge vendeur | Nouveau / Vérifié / Top Vendeur | 🔴 Haute |
| Note moyenne | Calcul basé sur les avis | 🔴 Haute |
| Temps de réponse | Délai moyen réponse messages | 🟡 Moyenne |
| Taux de satisfaction | % avis positifs | 🔴 Haute |
| Historique ventes | Nombre total de ventes | 🔴 Haute |

**User Story :** *En tant que vendeur, je veux obtenir le badge "Top Vendeur" pour attirer plus de clients.*

---

## MVP - ACHETEUR

### 1. Navigation & Découverte

| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Page d'accueil | Produits tendance, catégories | 🔴 Haute |
| Catalogue produits | Liste avec filtres | 🔴 Haute |
| Recherche | Par nom, catégorie, vendeur | 🔴 Haute |
| Filtres | Prix, note, localisation, catégorie | 🔴 Haute |
| Tri | Prix croissant/décroissant, popularité | 🔴 Haute |
| Catégories | Organisation par thème | 🔴 Haute |
| Produits similaires | "Vous aimerez aussi" | 🟡 Moyenne |

**User Story :** *En tant qu'acheteur, je veux trouver un produit en moins de 30 secondes.*

---

### 2. Page Produit

| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Galerie photos | Zoom, plein écran | 🔴 Haute |
| Titre & Description | Détails complets | 🔴 Haute |
| Prix | Prix actuel + ancien prix si promo | 🔴 Haute |
| Variantes | Sélection taille/couleur | 🔴 Haute |
| Stock | "En stock" / "Plus que X" / "Rupture" | 🔴 Haute |
| Avis clients | Notes + commentaires | 🔴 Haute |
| Profil vendeur | Photo, note, nombre ventes | 🔴 Haute |
| Politique retour | Conditions affichées | 🔴 Haute |
| Livraison estimée | Délai + frais | 🔴 Haute |
| Ajouter au panier | CTA clair | 🔴 Haute |
| Ajouter aux favoris | Wishlist | 🟡 Moyenne |
| Partager | Réseaux sociaux | 🟢 Basse |

**User Story :** *En tant qu'acheteur, je veux voir les avis avant d'acheter.*

---

### 3. Panier & Checkout

| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Panier | Produits sélectionnés | 🔴 Haute |
| Modifier quantité | + / - | 🔴 Haute |
| Supprimer produit | Retirer du panier | 🔴 Haute |
| Code promo | Appliquer réduction | 🔴 Haute |
| Résumé commande | Sous-total, livraison, total | 🔴 Haute |
| Adresse livraison | Formulaire + adresses sauvegardées | 🔴 Haute |
| Choix livraison | Standard / Express | 🔴 Haute |
| Paiement | Carte, PayPal, Apple Pay | 🔴 Haute |
| Confirmation | Page succès + email | 🔴 Haute |

**User Story :** *En tant qu'acheteur, je veux payer en 3 clics maximum.*

---

### 4. Suivi de Commande

| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Historique commandes | Liste des achats | 🔴 Haute |
| Détail commande | Produits, statut, suivi | 🔴 Haute |
| Numéro de suivi | Lien vers transporteur | 🔴 Haute |
| Notification statut | Email à chaque changement | 🔴 Haute |
| Annuler commande | Si pas pas �bitabelaselmuconrecoseleltitaela tu elasesaelelenenezaza el备受elaitabes laarpclus que el tu que queutun elel tuquepeltuearesperenteelelel mide eladelo mucho respir allign elap el el incomper hayat estey que que queelelildeela mioanteelion可爱 muchoensio elAoaairesy que elcreelaselel3az enity** amor<think>as<oviarasadaelaeladoselelalastoconaielas**



**

terminiser les filtres (prix, catégorie, vendeur vérifié)
- **Avis vérifiés** : Seuls les acheteurs réels peuvent laisser un avis
- **Badge vendeur** : Vérifié, Top Vendeur, Nouveau
- **Paiement sécurisé** : Stripe + protection acheteur
- **Garantie remboursement** : 30 jours pour retour
- **Support réactif** : Réponse du vendeur sous 24h

---

## Roadmap MVP

| Phase | Durée | Ven deur | Acheteur |
|-------|-------|----------|----------|
| Sprint 1-2 | 4 sem | Inscription + Boutique | - |
| Sprint 3-4 | 4 sem | Produits + Dashboard | Navigation + Page produit |
| Sprint 5-6 | 4 sem | Commandes + Paiements | Panier + Checkout |
| Sprint 7-8 | 4 sem | Réputation + Messages | Suivi + Avis |
| **Lancement** | **Sem 16** | **v1.0 Vendeur** | **v1.0 Acheteur** |

---

*Dernière mise à jour: 18 Septembre 2026*
