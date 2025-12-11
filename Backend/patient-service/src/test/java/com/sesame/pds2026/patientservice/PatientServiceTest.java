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
        patient.setFirstName("John");
        patient.setLastName("Doe");
        patient.setDateOfBirth(LocalDate.of(1990, 1, 1));
        patient.setUserId(1L);

        Mockito.when(patientRepository.save(any(Patient.class))).thenAnswer(invocation -> {
            Patient p = invocation.getArgument(0);
            p.setId(1L); // Simulate DB ID generation
            return p;
        });

        Patient created = patientService.createPatient(patient);

        Assertions.assertNotNull(created.getId());
        Assertions.assertEquals("John", created.getFirstName());
        Assertions.assertNotNull(created.getDossierMedical());
        Assertions.assertEquals("CREATED", created.getDossierMedical().getStatus());
        Assertions.assertEquals(patient, created.getDossierMedical().getPatient());
    }
}
