package dev.stanczak.mininter.config;

import io.minio.MinioClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class MinioConfig {

    @Value("${minio.url}")
    private String internalUrl;

    @Value("${minio.public-url}")
    private String publicUrl;

    @Value("${minio.access.name}")
    private String accessKey;

    @Value("${minio.access.secret}")
    private String accessSecret;

    @Bean("minioClient")
    @Primary
    public MinioClient minioClient() {
        return MinioClient.builder()
                .endpoint(internalUrl)
                .credentials(accessKey, accessSecret)
                .region("us-east-1")
                .build();
    }

    @Bean("minioPublicClient")
    public MinioClient minioPublicClient() {
        return MinioClient.builder()
                .endpoint(publicUrl)
                .credentials(accessKey, accessSecret)
                .region("us-east-1")
                .build();
    }
}