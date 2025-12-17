package com.sesame.pds2026.gatewayservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
            .csrf(ServerHttpSecurity.CsrfSpec::disable)
            .authorizeExchange(exchanges -> exchanges
                // Public Endpoints
                .pathMatchers("/actuator/**").permitAll()
                .pathMatchers("/*/swagger-ui/**").permitAll()
                .pathMatchers("/*/v3/api-docs/**").permitAll()
                .pathMatchers("/webjars/**").permitAll()
                // Allow OPTIONS for CORS
                .pathMatchers(org.springframework.http.HttpMethod.OPTIONS).permitAll()
                
                // Secure everything else
                .anyExchange().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> {}));
            
        return http.build();
    }
}
