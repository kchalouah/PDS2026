import { HeaderItem } from "@/types/menu";

// Public Menu
export const headerData: HeaderItem[] = [
  { label: "Homepage", href: "/" },
  { label: "Services", href: "/#features" },
  { label: "Contact", href: "/contact" },
];

// Patient Menu
export const patientMenu: HeaderItem[] = [
  { label: "Dashboard", href: "/patient/dashboard" },
  { label: "My Appointments", href: "/patient/rendez-vous" },
  { label: "My Records", href: "/patient/dossier" },
  { label: "Doctors", href: "/patient/medecins" },
];

// Medecin Menu
export const medecinMenu: HeaderItem[] = [
  { label: "Dashboard", href: "/medecin/dashboard" },
  { label: "Schedule", href: "/medecin/agenda" },
  { label: "Patients", href: "/medecin/patients" },
  { label: "Prescriptions", href: "/medecin/prescriptions" },
];

// Admin Menu
export const adminMenu: HeaderItem[] = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Users", href: "/admin/users" },
  { label: "Logs", href: "/admin/logs" },
  { label: "System", href: "/admin/dashboard" },
];

// Manager Menu
export const managerMenu: HeaderItem[] = [
  { label: "Dashboard", href: "/manager/dashboard" },
  { label: "Doctors", href: "/manager/medecins" },
  { label: "Patients", href: "/manager/patients" },
];

// Security Menu
export const securityMenu: HeaderItem[] = [
  { label: "Dashboard", href: "/security/dashboard" },
  { label: "Audit Logs", href: "/security/logs" },
  { label: "Health", href: "/security/health" },
];  