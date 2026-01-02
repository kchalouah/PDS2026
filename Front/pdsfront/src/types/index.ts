export enum Role {
  ADMIN = 'ADMIN',
  PATIENT = 'PATIENT',
  MEDECIN = 'MEDECIN',
  RESPONSABLE_SECURITE = 'RESPONSABLE_SECURITE',
  GESTIONNAIRE = 'GESTIONNAIRE'
}

export interface User {
  id: string; // Keycloak ID
  username: string; // Email
  firstName: string;
  lastName: string;
  email: string;
  roles: Role[];
}

export interface ProfileInfo {
  dateNaissance: string;
  adresse: {
    rue: string;
    ville: string;
    codePostal: string;
    pays: string;
  };
  telephone: string;
  telephoneSecondaire?: string;
}

export interface Patient {
  id: number;
  userId: string; // Keycloak ID
  nom: string;
  prenom: string;
  email: string;
  profile: ProfileInfo;
  gender: string;
  emergencyContact: string;
  role: Role.PATIENT;
}

export interface Medecin {
  id: number;
  userId: string;
  nom: string;
  prenom: string;
  email: string;
  specialite: string;
  profile: ProfileInfo;
  role: Role.MEDECIN;
}
