package com.sesame.pds2026.securityservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI securityServiceAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Security Service API")
                        .description("API for authentication, authorization, user management, and audit logging")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("MedInsight Team")
                                .email("support@medinsight.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0")));
    }
}
