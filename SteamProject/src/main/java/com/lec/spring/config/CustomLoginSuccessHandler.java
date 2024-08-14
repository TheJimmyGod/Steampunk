package com.lec.spring.config;

import com.lec.spring.jwt.JWTUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;

import java.io.IOException;
import java.net.URLEncoder;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class CustomLoginSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {
    private final JWTUtil jwtUtil;

    public CustomLoginSuccessHandler(String defaultTargetUrl, JWTUtil jwtUtil){
        this.jwtUtil = jwtUtil;
        setDefaultTargetUrl(defaultTargetUrl);
    }

    // 로그인 성공 직후 수행할 동작
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws ServletException, IOException {
        System.out.println("### 로그인 성공: onAuthenticationSuccess() 호출 ###");

        System.out.println("접속IP: " + getClientIp(request));
        PrincipalDetails userDetails = (PrincipalDetails)authentication.getPrincipal();
        Long id = userDetails.getUser().getId();
        String username = userDetails.getUsername();
        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
        String role = authorities.stream().map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));
        String token = jwtUtil.createJwt(id, username, role, 30 * 60 * 1000L);
        response.setHeader("Authorization", "Bearer " + token);
        // 로그인 직전 url 로 redirect 하기
        response.sendRedirect(getDefaultTargetUrl() + "?token=" + URLEncoder.encode(token, "UTF-8"));
    }


    // request 를 한 client ip 가져오기
    public static String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}








