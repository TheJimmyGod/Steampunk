package com.lec.spring.controller;

import com.lec.spring.domain.User;
import com.lec.spring.domain.UserDTO;
import com.lec.spring.service.UserService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/steam/user/")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }
    // 유저
    
    // 로그인

    // 회원가입
    @PostMapping("/register")
    public String register(@RequestBody UserDTO userDTO) {
        User user = User.builder()
                .username(userDTO.getUsername())
                .password(userDTO.getPassword())
                .address_main(userDTO.getAddress_main())
                .address_sub(userDTO.getAddress_sub())
                .birth(userDTO.getBirth())
                .build();
        user = userService.register(user);
        if (user == null) return "REGISTER FAILED";
        return "REGISTER OK : " + user;
    }
    // 개인정보 수정

    // 탈퇴

    // --------------------------------------------------------

    // 관리자

    // 뉴스 관리

    // 회원 관리

}