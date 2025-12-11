package com.sesame.pds2026.patientservice.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI patientServiceAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Patient Service API")
                        .description("API for managing patients, medical records (dossiers), and appointments")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("MedInsight Team")
                                .email("support@medinsight.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0")));
    }
}
