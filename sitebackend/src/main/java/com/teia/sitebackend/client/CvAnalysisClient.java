package com.teia.sitebackend.client;

import com.teia.sitebackend.service.CurriculoAnaliseInsights;

public interface CvAnalysisClient {

    CurriculoAnaliseInsights analisarCurriculo(String textoCurriculo);
}
