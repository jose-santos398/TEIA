package com.teia.sitebackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

@Configuration
public class CvAnalysisConfig {

    @Bean(name = "cvAnalysisRestClient")
    public RestClient cvAnalysisRestClient(
        RestClient.Builder builder,
        CvAnalysisProperties properties
    ) {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(properties.getTimeoutMs());
        requestFactory.setReadTimeout(properties.getTimeoutMs());

        RestClient.Builder configuredBuilder = builder.requestFactory(requestFactory);

        if (properties.getBaseUrl() != null && !properties.getBaseUrl().isBlank()) {
            configuredBuilder = configuredBuilder.baseUrl(properties.getBaseUrl());
        }

        return configuredBuilder.build();
    }
}
