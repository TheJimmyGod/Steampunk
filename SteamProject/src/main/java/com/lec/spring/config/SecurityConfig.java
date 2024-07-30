package com.lec.spring.config;

import com.lec.spring.jwt.JWTFilter;
import com.lec.spring.jwt.JWTUtil;
import com.lec.spring.jwt.LoginFilter;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Collections;
import java.util.List;

@Configuration
@EnableWebSecurity(debug = true) // 요청시 Security Filter Chain의 동작 확인 출력
//@EnableWebSecurity
public class SecurityConfig {
    @Value("${cors.allowed-origins}")
    private List<String> corsAllowedOrigins;
    private final AuthenticationConfiguration authenticationConfiguration;
    private final JWTUtil jwtUtil;
    public SecurityConfig(AuthenticationConfiguration authenticationConfiguration, JWTUtil jwtUtil) {
        this.authenticationConfiguration = authenticationConfiguration;
        this.jwtUtil = jwtUtil;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }


    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        // csrf disable
        http.csrf(AbstractHttpConfigurer::disable);

        // 웹서비스에서 사용할수 있는 여러 인증방법들..
        //  폼 인증, Http basic 인증, OAuth2 인증, JWT인증 등...
        //  이번 예제에선 JWT 인증을 사용할 것이므로
        // Form 인증방식과 http basic 인증방식은 disable 시켜야 한다.

        // Form 인증방식 disable
        http.formLogin(AbstractHttpConfigurer::disable);

        // Http basic 인증방식 disable
        http.httpBasic(AbstractHttpConfigurer::disable);

        //경로별 인가 작업
        http
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/admin").hasRole("ADMIN")
                        .requestMatchers("/member").hasAnyRole("MEMBER", "ADMIN")
                        .anyRequest().permitAll()
                );

        // 세션 설정
        http
                .sessionManagement((session) -> session
                        // JWT를 통한 인증/인가를 위해서 세션을 STATELESS 상태로 설정한다
                        // request 가 들어오면 세션을 생성했다가.  request 가 다 처리 되면 세션을 삭제하게 된다
                        //  명심! request 처리전까지는 세션이 존재하는 거구. 이 세션에는 SecurityContextHolder 에 인증정보가 있는 것이다.
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        // JWTFilter 등록. LoginFilter 앞에 위치
        http
                .addFilterBefore(new JWTFilter(jwtUtil), LoginFilter.class);
        //필터 추가 LoginFilter()는 AuthenticationManager 인자를 받음
        // authenticationManager() 메소드에 authenticationConfiguration 객체를 넣어야 함) 따라서 등록 필요
        // .addFilterAt(필터, 삽일할 위치)
        //   LoginFilter 를 SecurityFilter Chain 의 UsernamePasswordAuthenticationFilter 위치에 삽입 (그 위치를 replace 하게된다!)
        http
                .addFilterAt(new LoginFilter(authenticationManager(authenticationConfiguration), jwtUtil),
                        UsernamePasswordAuthenticationFilter.class);
        // ----------------------------------------------------------------
        // CORS 설정
        http
                .cors(corsConfigurer
                        -> corsConfigurer.configurationSource(new CorsConfigurationSource() {
                    @Override
                    public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
                        CorsConfiguration configuration = new CorsConfiguration();
                        // setAllowedOrigins(List<String>) Cors요청을 허용할 도메인(들) 설정.
                        // setAllowedMethods(List<String>) Cors요청을 허용할 request method(들) 설정
                        // setAllowCredentials(Boolean)  user credential 지원 여부.  (쿠키등..)
                        // setAllowedHeaders(List<String>) Cors요청을 허용할 헤더(들) 설정
                        // setMaxAge(Long)  preflight 요청에 대한 응답을 브라우저에서 캐싱하는 시간
                        // setExposedHeaders(List<String>)  응답헤더 설정(들) 추가
                        configuration.setAllowedOrigins(corsAllowedOrigins);
                        configuration.setAllowedMethods(List.of("*"));
                        configuration.setAllowCredentials(true);
                        configuration.setAllowedHeaders(Collections.singletonList("*"));
                        configuration.setMaxAge(3600L);
                        configuration.setExposedHeaders( List.of("Authorization"));
                        return configuration;
                    }
                }));

        return http.build();
    }

}
