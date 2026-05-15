package com.fit.monolithic.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String content) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(content, true);

        mailSender.send(message);
    }

    public void sendPasswordResetEmail(String to, String resetLink) throws MessagingException {
        String content = "<h3>Yêu cầu cấp lại mật khẩu</h3>" +
                "<p>Chào bạn,</p>" +
                "<p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản BookStore. Vui lòng click vào đường link bên dưới để thực hiện:</p>" +
                "<a href=\"" + resetLink + "\">Đặt lại mật khẩu</a>" +
                "<p>Link này sẽ hết hạn sau 15 phút.</p>" +
                "<p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.</p>";

        sendEmail(to, "[BookStore] Quên mật khẩu", content);
    }
}
