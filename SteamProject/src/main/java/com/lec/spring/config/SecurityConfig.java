package com.lec.spring.config;

import com.lec.spring.config.oauth.PrincipalOauth2UserService;
import com.lec.spring.jwt.JWTFilter;
import com.lec.spring.jwt.JWTUtil;
import com.lec.spring.jwt.LoginFilter;
import com.lec.spring.repository.AuthorityRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
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
//@EnableWebSecurity(debug = true) // 요청시 Security Filter Chain의 동작 확인 출력
@EnableWebSecurity
public class SecurityConfig {
    private final PrincipalOauth2UserService principalOauth2UserService;
    @Value("${cors.allowed-origins}")
    private List<String> corsAllowedOrigins;
    private final AuthenticationConfiguration authenticationConfiguration;
    private final AuthorityRepository authorityRepository;
    private final JWTUtil jwtUtil;
    public SecurityConfig(PrincipalOauth2UserService principalOauth2UserService, AuthenticationConfiguration authenticationConfiguration, JWTUtil jwtUtil, AuthorityRepository authorityRepository) {
        this.principalOauth2UserService = principalOauth2UserService;
        this.authenticationConfiguration = authenticationConfiguration;
        this.authorityRepository = authorityRepository;
        this.jwtUtil = jwtUtil;
    }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable);

        http.formLogin(AbstractHttpConfigurer::disable);

        http.httpBasic(AbstractHttpConfigurer::disable);

        http
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/admin").hasRole("ADMIN")
                        .requestMatchers("/member").hasAnyRole("MEMBER", "ADMIN")
                        .anyRequest().permitAll()
                );

        // 세션 설정
        http
                .sessionManagement((session) -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        http
                .addFilterBefore(new JWTFilter(jwtUtil, authorityRepository), LoginFilter.class);
        http
                .addFilterAt(jwtAuthorizationFilter(),
                        UsernamePasswordAuthenticationFilter.class);
        // ----------------------------------------------------------------
        // CORS 설정
        http
                .cors(corsConfigurer
                        -> corsConfigurer.configurationSource(new CorsConfigurationSource() {
                    @Override
                    public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
                        CorsConfiguration configuration = new CorsConfiguration();
                        configuration.setAllowedOrigins(corsAllowedOrigins);
                        configuration.setAllowedMethods(List.of("*"));
                        configuration.setAllowCredentials(true);
                        configuration.setAllowedHeaders(Collections.singletonList("*"));
                        configuration.setMaxAge(3600L);
                        configuration.setExposedHeaders( List.of("Authorization"));
                        return configuration;
                    }
                }));
        http.
                oauth2Login(httpSecurityOAuth2LoginConfigurer ->
                        httpSecurityOAuth2LoginConfigurer
                                .successHandler(new CustomLoginSuccessHandler("http://ec2-3-37-236-212.ap-northeast-2.compute.amazonaws.com:3000/steam/login/success", jwtUtil))
                                .failureHandler(new CustomLoginFailureHandler())
                                .userInfoEndpoint(userInfoEndpointConfig -> userInfoEndpointConfig
                                        .userService(principalOauth2UserService)));
        return http.build();
    }

    public LoginFilter jwtAuthorizationFilter() throws Exception {
        LoginFilter jwtAuthenticationFilter = new LoginFilter(authenticationManager(authenticationConfiguration),jwtUtil);
        jwtAuthenticationFilter.setFilterProcessesUrl("/steam/login");
        return jwtAuthenticationFilter;
    }
}
