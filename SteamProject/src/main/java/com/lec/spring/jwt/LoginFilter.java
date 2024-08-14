package com.lec.spring.jwt;

import com.lec.spring.config.PrincipalDetails;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.util.Collection;
import java.util.stream.Collectors;

public class LoginFilter extends UsernamePasswordAuthenticationFilter {
    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;

    public LoginFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        System.out.println("LoginFilter.attemptAuthentication() 호출");

        // request 에서 username, password 추출
        String username = obtainUsername(request);
        String password = obtainPassword(request);
        System.out.println(username + " " + password);

        System.out.printf("\t username:%s, password:%s\n", username, password);  // 검증 확인용.

        Authentication token = new UsernamePasswordAuthenticationToken(username != null ? username.toUpperCase() : null, password, null);

        return authenticationManager.authenticate(token);
    }

    // 로그인(인증) 성공시 실행되는 메소드 (여기서 JWT를 발급하자)
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException, ServletException {
        System.out.println("LoginFilter.successfulAuthentication() 호출: 인증 성공!");
        System.out.println("\tAuthentication: " + authResult);

        PrincipalDetails userDetails = (PrincipalDetails) authResult.getPrincipal();
        // JWT에 담을 내용(id, username, role, expire)
        Long id = userDetails.getUser().getId();
        String username = userDetails.getUsername();
        // Collection<? extends GrantedAuthority> -> 'ROLE_MEMBER, ROLE_ADMIN' 문자열로 만들기
        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
        String role = authorities.stream().map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));
        System.out.println("Role: " + role);
        String token = jwtUtil.createJwt(id, username, role, 30 * 60 * 1000L);
        response.addHeader("Authorization", "Bearer " + token);
    }
    //로그인 실패시 실행하는 메소드
    // 실패 원인은 AuthenticationException 를 보고 판단할수 있다
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {
        System.out.println("LoginFilter.unsuccessfulAuthentication() 호출: 인증 실패");
        //super.unsuccessfulAuthentication(request, response, failed);
        // 로그인 실패시 401 응답 코드 리턴
        response.setStatus(401);
    }
}
