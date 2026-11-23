package br.com.flaviofelix.spotmusic.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

  @Value("${FRONTEND_URL:}")
  private String frontendUrl;

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    List<String> origins = new ArrayList<>();
    origins.add("http://localhost:5173");

    if (frontendUrl != null && !frontendUrl.isBlank()) {
      for (String url : frontendUrl.split(",")) {
        String trimmed = url.trim();
        if (!trimmed.isEmpty() && !origins.contains(trimmed)) {
          origins.add(trimmed);
        }
      }
    } else {
      origins.add("*");
    }

    registry.addMapping("/**")
        .allowedOriginPatterns(origins.toArray(String[]::new))
        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
        .allowedHeaders("*");
  }
}
