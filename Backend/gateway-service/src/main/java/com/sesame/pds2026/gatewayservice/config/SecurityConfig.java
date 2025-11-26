package com.sesame.pds2026.gatewayservice.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.context.NoOpServerSecurityContextRepository;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        return http
                .csrf(csrf -> csrf.disable()) // Désactive CSRF (optionnel)
                .authorizeExchange(exchange -> exchange.anyExchange().permitAll()) // Autorise tout
                .securityContextRepository(NoOpServerSecurityContextRepository.getInstance()) // Pas de contexte de session
                .build();
    }
}
