package com.teia.sitebackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(@NonNull CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(
                                "http://localhost:5173",    // Vite dev server (padrão)
                                "http://localhost:5174",    // Vite dev server (alternativa)
                                "http://127.0.0.1:5173",    // Vite dev server (127.0.0.1)
                                "http://localhost:3000",    // React/Next.js dev server
                                "http://localhost:5000",    // Live Server
                                "http://localhost:8000",    // Python HTTP server
                                "http://127.0.0.1:5500",    // VS Code Live Server
                                "http://localhost:5500",    // VS Code Live Server
                                "file://"                   // Local file protocol
                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                        .allowedHeaders("*")
                        .allowCredentials(true)
                        .maxAge(3600);  // Cache preflight por 1 hora
            }
        };
    }
}