
package dev.stanczak.mininter.services;


import java.util.Optional;
import java.util.List;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import dev.stanczak.mininter.dto.DeleteUserRequest;
import dev.stanczak.mininter.dto.UpdatePasswordRequest;
import dev.stanczak.mininter.dto.UpdateUserRequest;
import dev.stanczak.mininter.dto.UserResponse;
import dev.stanczak.mininter.exceptions.InvalidCredentialsException;
import dev.stanczak.mininter.exceptions.StorageException;
import dev.stanczak.mininter.exceptions.UsernameAlreadyExistsException;
import dev.stanczak.mininter.models.Community;
import dev.stanczak.mininter.models.Post;
import dev.stanczak.mininter.models.Users;
import dev.stanczak.mininter.repositories.CommentRepository;
import dev.stanczak.mininter.repositories.CommunityMemberRepository;
import dev.stanczak.mininter.repositories.CommunityRepository;
import dev.stanczak.mininter.repositories.FollowRepository;
import dev.stanczak.mininter.repositories.LikeRepository;
import dev.stanczak.mininter.repositories.PostRepository;
import dev.stanczak.mininter.repositories.UsersRepository;
import dev.stanczak.mininter.validation.ImageValidator;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.Http.Method;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;


@Service
@Transactional
public class UserService {

    private final MinioClient minioClient;
    private final MinioClient minioPublicClient;
    private final ImageValidator imageValidator;
    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;
    private final PostRepository postRepository;
    private final LikeRepository likeRepository;
    private final FollowRepository followRepository;
    private final CommentRepository commentRepository;
    private final CommunityRepository communityRepository;
    private final CommunityMemberRepository communityMemberRepository;

    public UserService(
            @Qualifier("minioClient") MinioClient minioClient,
            @Qualifier("minioPublicClient") MinioClient minioPublicClient,
            ImageValidator imageValidator,
            UsersRepository usersRepository,
            PasswordEncoder passwordEncoder,
            PostRepository postRepository,
            LikeRepository likeRepository,
            FollowRepository followRepository,
            CommentRepository commentRepository,
            CommunityRepository communityRepository,
            CommunityMemberRepository communityMemberRepository
    ) {
        this.minioClient = minioClient;
        this.minioPublicClient = minioPublicClient;
        this.imageValidator = imageValidator;
        this.usersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
        this.postRepository = postRepository;
        this.likeRepository = likeRepository;
        this.followRepository = followRepository;
        this.commentRepository = commentRepository;
        this.communityRepository = communityRepository;
        this.communityMemberRepository = communityMemberRepository;
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

        users.setAvatarKey(users.getId() + "/avatar.jpg");
        usersRepository.save(users);
    }

    public String getAvatar(Users users) {
        try {
            return minioPublicClient.getPresignedObjectUrl(
                GetPresignedObjectUrlArgs.builder()
                    .method(Method.GET)
                    .bucket("avatars")
                    .object(users.getId() + "/avatar.jpg")
                    .expiry(60 * 60)
                    .build()
            );
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar URL do avatar", e);
        }
}

    public Optional<UserResponse> getUsersById(Long id) {
        return usersRepository.findById(id).map(u -> {
            UserResponse r = new UserResponse();
            r.setUsername(u.getUsername());
            r.setDisplayName(u.getDisplayName());
            r.setBio(u.getBio());
            r.setImageUrl(getAvatar(u));
            return r;
        });
    }

    public UserResponse getUserProfileDetails(Users user) {
        UserResponse userResponse = new UserResponse();
        userResponse.setUsername(user.getUsername());
        userResponse.setDisplayName(user.getDisplayName());
        userResponse.setBio(user.getBio());
        userResponse.setImageUrl(getAvatar(user));
        return userResponse;
    }

    @Transactional
    public void updateDataUser(Users users, UpdateUserRequest updateUserRequest) {

        if (updateUserRequest.getUsername() != null) {
            String newUsername = updateUserRequest.getUsername().trim().toLowerCase(Locale.ROOT);
            if (newUsername.isEmpty()) {
                throw new IllegalArgumentException("Nome de usuário não pode estar vazio");
            }
            if (!newUsername.equals(users.getUsername()) && usersRepository.existsByUsername(newUsername)) {
                throw new UsernameAlreadyExistsException("Nome de usuário já está em uso");
            }
            users.setUsername(newUsername);
        }
        if (updateUserRequest.getDisplayName() != null) {
            users.setDisplayName(updateUserRequest.getDisplayName());
        }
        if (updateUserRequest.getBio() != null) {
            users.setBio(updateUserRequest.getBio());
        }
        usersRepository.save(users);
    }

    @Transactional
    public void updatePassword(Users users, UpdatePasswordRequest updatePasswordRequest) {
        if (!passwordEncoder.matches(updatePasswordRequest.getCurrentPassword(), users.getPassword())) {
            throw new InvalidCredentialsException("Senha atual incorreta");
        }

        if (passwordEncoder.matches(updatePasswordRequest.getNewPassword(), users.getPassword())) {
            throw new IllegalArgumentException("A nova senha deve ser diferente da senha atual");
        }

        users.setPassword(passwordEncoder.encode(updatePasswordRequest.getNewPassword()));
        users.setTokenVersion(users.getTokenVersion() + 1);
        usersRepository.save(users);
    }

    @Transactional
    public void deleteUser(Users users, DeleteUserRequest deleteUserRequest) {
        if (!passwordEncoder.matches(deleteUserRequest.getPassword(), users.getPassword())) {
            throw new InvalidCredentialsException("Senha incorreta");
        } else if (deleteUserRequest.getPassword() == null || deleteUserRequest.getPassword().isEmpty()) {
            throw new IllegalArgumentException("Senha não pode estar vazia");
        }

        Long userId = users.getId();
        List<Post> posts = postRepository.findAllByAuthorId(userId);
        List<Long> commentIds = commentRepository.findIdsForUserOrTheirPosts(userId);
        List<Long> ownedCommunityIds = communityRepository.findAllByOwnerId(userId).stream()
                .map(Community::getId)
                .toList();

        removeUserObjects(users, posts);

        if (!commentIds.isEmpty()) {
            commentRepository.clearParentReferences(commentIds);
            commentRepository.deleteAllByIdInBatch(commentIds);
        }
        likeRepository.deleteByUserId(userId);
        likeRepository.deleteByPostAuthorId(userId);
        followRepository.deleteByFollowerIdOrFollowingId(userId, userId);
        communityMemberRepository.deleteByUserId(userId);
        if (!ownedCommunityIds.isEmpty()) {
            communityMemberRepository.deleteByCommunityIdIn(ownedCommunityIds);
            communityRepository.deleteByOwnerId(userId);
        }
        postRepository.deleteByAuthorId(userId);
        usersRepository.delete(users);
    }

    private void removeUserObjects(Users users, List<Post> posts) {
        try {
            for (Post post : posts) {
                if (post.getImageKey() != null) {
                    minioClient.removeObject(RemoveObjectArgs.builder()
                            .bucket("posts")
                            .object(post.getImageKey())
                            .build());
                }
            }
            minioClient.removeObject(RemoveObjectArgs.builder()
                    .bucket("avatars")
                    .object(users.getId() + "/avatar.jpg")
                    .build());
        } catch (Exception exception) {
            throw new StorageException("Erro ao remover arquivos do usuário", exception);
        }
    }

}
