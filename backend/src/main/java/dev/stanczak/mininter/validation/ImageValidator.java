package dev.stanczak.mininter.validation;


import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;

import javax.imageio.ImageIO;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component 
public class ImageValidator {

    public void validadeImage(MultipartFile file) {
        final Long maxFileSize = 12L * 1024 * 1024;
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("A foto é obrigatória.");
        }
        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("A foto não pode ter mais de 12 MB.");
        }
        if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
            throw new IllegalArgumentException("O arquivo deve ser uma imagem.");
        }
    }
    
    public void validateAvatar(MultipartFile file) {

        validadeImage(file);

        try (InputStream inputStream = file.getInputStream()) {
            BufferedImage image = ImageIO.read(inputStream);
            if (image == null) {
                throw new IllegalArgumentException("O arquivo não é uma imagem válida.");
            }
            if (image.getWidth() != 400 || image.getHeight() != 400) {
                throw new IllegalArgumentException("A foto de perfil deve ter 400 x 400 pixels.");
            }
        } catch (IOException exception) {
            throw new IllegalArgumentException("Não foi possível validar a foto.", exception);
        }
    }

}
