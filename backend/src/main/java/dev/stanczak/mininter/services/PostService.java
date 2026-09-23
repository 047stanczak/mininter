package dev.stanczak.mininter.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import dev.stanczak.mininter.dto.PostRequest;
import dev.stanczak.mininter.dto.PostResponse;
import dev.stanczak.mininter.models.Post;
import dev.stanczak.mininter.models.Users;
import dev.stanczak.mininter.repositories.PostRepository;
import dev.stanczak.mininter.validation.ImageValidator;
import io.minio.Http.Method;
import io.minio.MinioClient;

@Service 
public class PostService {

    private final ImageValidator imageValidator;
    private final MinioClient minioClient;
    private final MinioClient minioPublicClient;
    private final PostRepository postRepository;

    public PostService(
        ImageValidator imageValidator, 
        @Qualifier("minioClient") MinioClient minioClient,
        @Qualifier("minioPublicClient") MinioClient minioPublicClient,
        PostRepository postRepository) {
        this.imageValidator = imageValidator;
        this.minioClient = minioClient;
        this.minioPublicClient = minioPublicClient;
        this.postRepository = postRepository;
    }
    
    public void createPost(Users users, PostRequest postRequest) throws Exception {

        imageValidator.validatePostImage(postRequest.getImage());

        String imageKey = users.getId() + "/" + System.currentTimeMillis() + ".jpg";

        minioClient.putObject(
            io.minio.PutObjectArgs.builder()
                .bucket("posts")
                .object(imageKey)
                .stream(postRequest.getImage().getInputStream(), postRequest.getImage().getSize(), (long) -1)
                .contentType(postRequest.getImage().getContentType())
                .build()
        );

        Post post = new Post();
        post.setAuthor(users);
        post.setContent(postRequest.getContent());
        post.setImageKey(imageKey);
        postRepository.save(post);
    }

    public List<PostResponse> getPosts() throws Exception {
        List<PostResponse> responses = new ArrayList<>();

        for (Post post : postRepository.findAll()) {
            PostResponse postResponse = new PostResponse();
            postResponse.setContent(post.getContent());
            postResponse.setImageUrl(minioPublicClient.getPresignedObjectUrl(
                io.minio.GetPresignedObjectUrlArgs.builder()
                    .method(Method.GET)
                    .bucket("posts")
                    .object(post.getImageKey())
                    .expiry(60 * 60)
                    .build()
            ));
            responses.add(postResponse);
        }

        return responses;
    }

}
