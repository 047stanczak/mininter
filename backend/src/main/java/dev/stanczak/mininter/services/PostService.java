package dev.stanczak.mininter.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import dev.stanczak.mininter.dto.PostRequest;
import dev.stanczak.mininter.dto.PostResponse;
import dev.stanczak.mininter.exceptions.PostNotFoundException;
import dev.stanczak.mininter.exceptions.StorageException;
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
    
    public void createPost(Users users, PostRequest postRequest) {

        String imageKey = null;

        if (postRequest.getImage() != null && !postRequest.getImage().isEmpty()) {
            imageKey = users.getId() + "/" + System.currentTimeMillis() + ".jpg";
            imageValidator.validatePostImage(postRequest.getImage());

            try {
                minioClient.putObject(
                    io.minio.PutObjectArgs.builder()
                        .bucket("posts")
                        .object(imageKey)
                        .stream(postRequest.getImage().getInputStream(), postRequest.getImage().getSize(), (long) -1)
                        .contentType(postRequest.getImage().getContentType())
                        .build()
                );
            } catch (Exception e) {
                throw new StorageException("Erro ao enviar imagem para o storage", e);
            }
        }

        Post post = new Post();
        post.setAuthor(users);
        post.setContent(postRequest.getContent());
        post.setImageKey(imageKey);
        postRepository.save(post);
    }

    public List<PostResponse> getPosts() {
        List<PostResponse> responses = new ArrayList<>();

        for (Post post : postRepository.findAll()) {
            PostResponse postResponse = new PostResponse();
            postResponse.setId(post.getId());
            postResponse.setContent(post.getContent());
            if (post.getImageKey() != null) {
                try {
                    postResponse.setImageUrl(minioPublicClient.getPresignedObjectUrl(
                        io.minio.GetPresignedObjectUrlArgs.builder()
                            .method(Method.GET)
                            .bucket("posts")
                            .object(post.getImageKey())
                            .expiry(60 * 60)
                            .build()
                    ));
                } catch (Exception e) {
                    throw new StorageException("Erro ao gerar URL da imagem", e);
                }
            }
            responses.add(postResponse);
        }

        return responses;
    }

    public PostResponse getPostById(Long postId) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new PostNotFoundException("Post não encontrado com o ID: " + postId));
        PostResponse postResponse = new PostResponse();
        postResponse.setId(post.getId());
        postResponse.setContent(post.getContent());
        if (post.getImageKey() != null) {
            try {
                postResponse.setImageUrl(minioPublicClient.getPresignedObjectUrl(
                    io.minio.GetPresignedObjectUrlArgs.builder()
                        .method(Method.GET)
                        .bucket("posts")
                        .object(post.getImageKey())
                        .expiry(60 * 60)
                        .build()
                ));
            } catch (Exception e) {
                throw new StorageException("Erro ao gerar URL da imagem", e);
            }
        }
        return postResponse;
    }

    public PostResponse updatePost(Users users, Long postId, PostRequest postRequest) {
        Post post = postRepository.findById(postId)
        .orElseThrow(() -> new PostNotFoundException("Post não encontrado com o ID: " + postId));

        if (!post.getAuthor().getId().equals(users.getId())) {
            throw new AccessDeniedException("Sem permissão para editar este post");
        }

        if (postRequest.getContent() != null) {
            post.setContent(postRequest.getContent());
        }

        if (postRequest.getImage() != null && !postRequest.getImage().isEmpty()) {
            String imageKey = post.getAuthor().getId() + "/" + System.currentTimeMillis() + ".jpg";
            imageValidator.validatePostImage(postRequest.getImage());

            try {
                minioClient.putObject(
                    io.minio.PutObjectArgs.builder()
                        .bucket("posts")
                        .object(imageKey)
                        .stream(postRequest.getImage().getInputStream(), postRequest.getImage().getSize(), (long) -1)
                        .contentType(postRequest.getImage().getContentType())
                        .build()
                );
                if (post.getImageKey() != null) {
                    minioClient.removeObject(
                        io.minio.RemoveObjectArgs.builder()
                            .bucket("posts")
                            .object(post.getImageKey())
                            .build()
                    );
                }
                post.setImageKey(imageKey);
            } catch (Exception e) {
                throw new StorageException("Erro ao enviar imagem para o storage", e);
            }
        }

        postRepository.save(post);

        return getPostById(postId);
    }

    public void deletePost(Users users, Long postId) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new PostNotFoundException("Post não encontrado com o ID: " + postId));

        if (!post.getAuthor().getId().equals(users.getId())) {
            throw new AccessDeniedException("Sem permissão para excluir este post");
        }

        if (post.getImageKey() != null) {
            try {
                minioClient.removeObject(
                    io.minio.RemoveObjectArgs.builder()
                        .bucket("posts")
                        .object(post.getImageKey())
                        .build()
                );
            } catch (Exception e) {
                throw new StorageException("Erro ao remover imagem do storage", e);
            }
        }

        postRepository.delete(post);
    }

}