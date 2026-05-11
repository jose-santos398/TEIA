package com.teia.sitebackend.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "ai.cv-analysis")
public class CvAnalysisProperties {

    private static final Logger LOGGER = LoggerFactory.getLogger(CvAnalysisProperties.class);

    private boolean enabled = true;
    private String baseUrl = "https://api.openai.com/v1";
    private String apiKey = "";
    private String model = "gpt-5-nano";
    private int timeoutMs = 60000;
    private int maxChars = 12000;
    private int maxCompletionTokens = 2000;
    private String reasoningEffort = "minimal";

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getBaseUrl() {
        return baseUrl;
    }

    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public int getTimeoutMs() {
        return timeoutMs;
    }

    public void setTimeoutMs(int timeoutMs) {
        this.timeoutMs = timeoutMs;
    }

    public int getMaxChars() {
        return maxChars;
    }

    public void setMaxChars(int maxChars) {
        this.maxChars = maxChars;
    }

    public int getMaxCompletionTokens() {
        return maxCompletionTokens;
    }

    public void setMaxCompletionTokens(int maxCompletionTokens) {
        this.maxCompletionTokens = maxCompletionTokens;
    }

    public String getReasoningEffort() {
        return reasoningEffort;
    }

    public void setReasoningEffort(String reasoningEffort) {
        this.reasoningEffort = reasoningEffort;
    }

    @PostConstruct
    void logStartupStatus() {
        if (!enabled) {
            LOGGER.info("CV analysis integration is disabled (ai.cv-analysis.enabled=false)");
            return;
        }

        if (estaEmBranco(baseUrl) || estaEmBranco(model) || estaEmBranco(apiKey)) {
            LOGGER.warn(
                "CV analysis integration is enabled but incomplete. baseUrlSet={}, modelSet={}, apiKeySet={}",
                !estaEmBranco(baseUrl),
                !estaEmBranco(model),
                !estaEmBranco(apiKey)
            );
            return;
        }

        LOGGER.info(
            "CV analysis integration is enabled. baseUrl={}, model={}, timeoutMs={}, maxChars={}, maxCompletionTokens={}, reasoningEffort={}",
            baseUrl,
            model,
            timeoutMs,
            maxChars,
            maxCompletionTokens,
            reasoningEffort
        );
    }

    private boolean estaEmBranco(String valor) {
        return valor == null || valor.isBlank();
    }
}
