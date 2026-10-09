package dev.stanczak.mininter.security;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;

import dev.stanczak.mininter.models.Users;

@Service
public class TokenSecurity {

    @Value("${JWT_SECRET}")
    private String secret;

    public String generateToken(Users user) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.create()
                    .withIssuer("mininter")
                    .withSubject(user.getEmail())
                    .withClaim("id", user.getId())
                    .withClaim("username", user.getUsername())
                    .withClaim("tokenVersion", user.getTokenVersion())
                    .withExpiresAt(generateExpirationDate())
                    .sign(algorithm);
        } catch (JWTCreationException e) {
            throw new RuntimeException("Erro ao gerar token de autenticação", e);
        }
    }

    public String validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer("mininter")
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException exception) {
            return null;
        }
    }

    public boolean isTokenValidForUser(String token, Users user) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            var decodedToken = JWT.require(algorithm)
                    .withIssuer("mininter")
                    .build()
                    .verify(token);
            Long tokenUserId = decodedToken.getClaim("id").asLong();
            Integer tokenVersion = decodedToken.getClaim("tokenVersion").asInt();
            return user.getId().equals(tokenUserId)
                    && user.getTokenVersion() == (tokenVersion == null ? 0 : tokenVersion);
        } catch (JWTVerificationException exception) {
            return false;
        }
    }

    private Instant generateExpirationDate() {
        return LocalDateTime.now().plusHours(8).toInstant(ZoneOffset.of("-03:00"));
    }
}
