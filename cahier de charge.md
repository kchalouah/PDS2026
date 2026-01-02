# Cahier des Charges - MedInsight (Plateforme Médicale Intelligente)

## 1 - Contexte et définition du problème
Dans le cadre de la modernisation des infrastructures de santé, la gestion administrative (rendez-vous), le suivi médical (dossiers, ordonnances) et la sécurité des données restent des défis majeurs. Les praticiens et gestionnaires manquent d'outils centralisés et sécurisés intégrant de l'intelligence artificielle.
Problèmes ciblés :
   Perte de temps dans la gestion manuelle des rendez-vous.
   Fragmentation des données médicales et manque de vision globale (statistiques).
   Besoin critique de traçabilité et de sécurité des données de santé.

## 2 - Objectif de projet
Créer une plateforme web unifiée (MedInsight) permettant la gestion complète du parcours de soin :
   Prise de rendez-vous en ligne et gestion d'agenda.
   Dossier Médical Partagé (numérisation des antécédents, consultations).
   Gestion des Ordonnances et Historique.
   Supervision & Statistiques pour les gestionnaires.
   Audit & Sécurité pour la conformité RGPD.
   Assistance par IA (Python) pour l'analyse prédictive.

## 3 - Acteurs
   Admin : Configuration technique, déploiement, maintenance système.
   Médecin : Consultation du planning, gestion clinique des dossiers, prédictions IA, ordonnances.
   Patient : Prise de rendez-vous, accès dossier simplifié, ordonnances.
   Gestionnaire : Supervision administrative, gestion globale des dossiers médicaux, visualisations des statistiques (KPIs) et reporting.
   Responsable Sécurité : Audit des accès, surveillance des logs (Sécurité/Intrusion), garantie de la conformité RGPD.

## 4 – Besoins fonctionnels
   Authentification & Sécurité : SSO, MFA, Gestion fine des droits (RBAC).
   Gestion des RDV : Calendrier, réservation, rappels automatiques.
   Dossier Médical : CRUD complet, recherche avancée, historique.
   Reporting & Stats : Tableaux de bord pour le Gestionnaire (nb consultations, pathologies fréquentes).
   Audit Logs : Traçabilité immuable de toutes les actions (qui a vu quoi ?) pour le Responsable Sécurité.
   Module IA : Prédictions médicales.

## 5 – Besoins non fonctionnels
   Sécurité & Conformité : Chiffrement de bout en bout, HDS (Hébergement Données de Santé).
   Audibilité : Logs centralisés non altérables.
   Scalabilité : Kubernetes (Auto-scaling).
   Performance : Temps de réponse optimisés pour la consultation de dossiers.

## 6 – Architecture (Microservices)
   Frontend : Next.js (React).
   Backend Services :
       `security-service` : Auth (Keycloak).
       `patient-service` : Info état civil.
       `dossier-service` : Données médicales.
       `gestion-service` : RDV & Stats.
       `audit-service` : Collecte des logs de sécurité.
       `ml-service` : IA Python.
       `gateway-service` : Routage.

## 7 – Choix technologiques
   Frontend : Next.js, Tailwind CSS.
   Backend : Spring Boot (Java), FastAPI (Python).
   Base de Données : PostgreSQL, MongoDB (Logs Audit).
   Infrastructure :
       Cloud : AWS.
       Orchestration : Kubernetes (EKS).
       Monitoring : Grafana, Prometheus.
       Logging/Audit : Loki (Centralisation des logs pour le Responsable Sécurité).

## 8 - Backlog Produit (Scrum)

### Epic 1 : Socle Technique & Sécurité (Admin / Resp. Sécurité)
   US-1.1 : En tant qu'Admin, je veux déployer Keycloak pour gérer l'authentification centralisée.
   US-1.2 : En tant que Responsable Sécurité, je veux que toutes les tentatives de connexion soient loguées pour détecter les intrusions.
   US-1.3 : En tant que Responsable Sécurité, je veux un dashboard (Grafana) pour visualiser les alertes de sécurité en temps réel.

### Epic 2 : Gestion Administrative & Stats (Gestionnaire)
   US-2.1 : En tant que Gestionnaire, je veux accéder à la liste complète des dossiers médicaux pour des vérifications administratives.
   US-2.2 : En tant que Gestionnaire, je veux voir des statistiques (nombre de patients, motifs de consultation) pour analyser l'activité.
   US-2.3 : En tant que Gestionnaire, je veux exporter des rapports d'activité (PDF/Excel).

### Epic 3 : Parcours de Soin (Médecin / Patient)
   US-3.1 : En tant que Médecin, je veux créer une consultation et l'ajouter au dossier du patient.
   US-3.2 : En tant que Médecin, je veux prescrire une ordonnance numérisée.
   US-3.3 : En tant que Patient, je veux prendre rendez-vous en ligne via une interface simple.

### Epic 4 : Intelligence Artificielle (Médecin)
   US-4.1 : En tant que Médecin, je veux solliciter l'IA pour obtenir une probabilité de diagnostic.

### Epic 5 : Infrastructure & Audit (Ops / Resp. Sécurité)
   US-5.1 : Déployer la stack Loki/Promtail pour l'agrégation des logs.
   US-5.2 : Configurer les règles de rétention des logs d'audit (conformité légale).
   US-5.3 : Déployer sur AWS EKS avec des politiques de sécurité réseau strictes (Network Policies).

## 9 - Planning prévisionnel
   Mois 1 : Architecture, Sécurité (Keycloak), Socle Audit.
   Mois 2 : Gestion des Dossiers (Back/Front) et Rôle Gestionnaire.
   Mois 3 : RDV, Ordonnances, Espace Patient.
   Mois 4 : IA, Dashboards de Sécurité & Stats.
   Mois 5 : Déploiement Cloud (AWS/K8s), Audit final.
