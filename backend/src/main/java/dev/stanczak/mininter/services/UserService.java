package dev.stanczak.mininter.services;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import dev.stanczak.mininter.models.Users;
import dev.stanczak.mininter.validation.ImageValidator;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.Http.Method;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;


@Service
public class UserService {

    private final MinioClient minioClient;
    private final MinioClient minioPublicClient;
    private final ImageValidator imageValidator;

    public UserService(
            @Qualifier("minioClient") MinioClient minioClient,
            @Qualifier("minioPublicClient") MinioClient minioPublicClient,
            ImageValidator imageValidator
    ) {
        this.minioClient = minioClient;
        this.minioPublicClient = minioPublicClient;
        this.imageValidator = imageValidator;
    }

    public void uploadAvatar(Users users, MultipartFile file) throws Exception {
        
        // Feed (Quadrado): 1080 × 1080 px (proporção 1:1)
        // Feed (Vertical/Retrato): 1080 × 1350 px (proporção 4:5)
        // Foto de Perfil: 400 × 400 px
        // Tamanho de 12mb

        imageValidator.validateAvatar(file);

        minioClient.putObject(
            PutObjectArgs.builder()
                .bucket("avatars")
                .object(users.getId() + "/avatar.jpg")
                .stream(file.getInputStream(), file.getSize(), (long) -1)
                .contentType(file.getContentType())
                .build()
        );
    }

    public String getAvatar(Users users) throws Exception {
        return minioPublicClient.getPresignedObjectUrl(
            GetPresignedObjectUrlArgs.builder()
                .method(Method.GET)
                .bucket("avatars")
                .object(users.getId() + "/avatar.jpg")
                .expiry(60 * 60)
                .build()
        );
    }
}