package dev.stanczak.mininter.services;

import org.springframework.stereotype.Service;

import dev.stanczak.mininter.dto.PostRequest;
import dev.stanczak.mininter.models.Users;
import dev.stanczak.mininter.validation.ImageValidator;
import io.minio.MinioClient;

@Service 
public class PostService {

    private final ImageValidator imageValidator;
    private final MinioClient minioClient;

    public PostService(ImageValidator imageValidator, MinioClient minioClient) {
        this.imageValidator = imageValidator;
        this.minioClient = minioClient;
    }
    
    public void createPost(Users users, PostRequest postRequest) throws Exception {
       
        // Feed (Quadrado): 1080 × 1080 px (proporção 1:1)
        // Feed (Vertical/Retrato): 1080 × 1350 px (proporção 4:5)
        
        imageValidator.validatePostImage(postRequest.getImage());

        minioClient.putObject(
            io.minio.PutObjectArgs.builder()
                .bucket("posts")
                .object(users.getId() + "/" + System.currentTimeMillis() + ".jpg")
                .stream(postRequest.getImage().getInputStream(), postRequest.getImage().getSize(), (long) -1)
                .contentType(postRequest.getImage().getContentType())
                .build()
        );

    }

}
