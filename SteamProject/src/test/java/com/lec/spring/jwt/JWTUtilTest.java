package com.lec.spring.jwt;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest
class JWTUtilTest {
    @Autowired
    private JWTUtil jwtUtil;
    @Test
    void test(){
        String jwtToken = jwtUtil.createJwt(1L, "USER1", "ROLE_MEMBER", 300000L);
        System.out.println(jwtToken);
        System.out.println("""
           id: %d
           username: %s
           role: %s
           isExpired: %s
       """.formatted(
                jwtUtil.getId(jwtToken),
                jwtUtil.getUsername(jwtToken),
                jwtUtil.getRole(jwtToken),
                jwtUtil.isExpired(jwtToken)));
    }

}