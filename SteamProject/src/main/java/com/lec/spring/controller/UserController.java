package com.lec.spring.controller;

import com.lec.spring.config.PrincipalDetails;
import com.lec.spring.domain.User;
import com.lec.spring.domain.UserDTO;
import com.lec.spring.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/steam")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }
    // 유저
    
    // 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(){
        return new ResponseEntity<>("OK", HttpStatus.OK);
    }

    // 회원가입
    @PostMapping("/register")
    public String register(@RequestBody UserDTO userDTO) {
        User user = User.builder()
                .username(userDTO.getUsername())
                .password(userDTO.getPassword())
                .re_password(userDTO.getRe_password())
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

    @GetMapping("/list")
    public ResponseEntity<?> findAll(){
        return new ResponseEntity<>(userService.FindAll(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> find(@PathVariable Long id){
        return new ResponseEntity<>(userService.findById(id), HttpStatus.OK);
    }
    @RequestMapping("/user")
    public User user(@AuthenticationPrincipal PrincipalDetails userDetails){
        return (userDetails != null) ? userDetails.getUser() : null;
    }
    // --------------------------------------------------------

    // 관리자

    // 뉴스 관리

    // 회원 관리

}