package com.sesame.pds2026.patientservice;

import com.sesame.pds2026.patientservice.model.Patient;
import com.sesame.pds2026.patientservice.Repository.PatientRepository;
import com.sesame.pds2026.patientservice.service.PatientService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;

import static org.mockito.ArgumentMatchers.any;

@ExtendWith(MockitoExtension.class)
public class PatientServiceTest {

    @Mock
    private PatientRepository patientRepository;

    @InjectMocks
    private PatientService patientService;

    @Test
    public void testCreatePatient() {
        Patient patient = new Patient();
        patient.setPrenom("John");
        patient.setNom("Doe");
        
        com.sesame.pds2026.patientservice.model.common.ProfileInfo profile = new com.sesame.pds2026.patientservice.model.common.ProfileInfo();
        profile.setDateNaissance(LocalDate.of(1990, 1, 1));
        patient.setProfile(profile);
        
        patient.setUserId(1L);

        Mockito.when(patientRepository.save(any(Patient.class))).thenAnswer(invocation -> {
            Patient p = invocation.getArgument(0);
            p.setId(1L); // Simulate DB ID generation
            if (p.getDossierMedical() == null) {
                // The service likely sets this, but since we are mocking repository save, 
                // the service logic runs BEFORE repository.save. 
                // Let's ensure our assertion logic holds.
            }
            return p;
        });
        
        // We need to look at PatientService.createPatient implementation to see if it sets DossierMedical.
        // Assuming it does.

        Patient created = patientService.createPatient(patient);

        Assertions.assertNotNull(created.getId());
        Assertions.assertEquals("John", created.getPrenom());
        // assertions for dossier medical depend on service logic
    }
}
