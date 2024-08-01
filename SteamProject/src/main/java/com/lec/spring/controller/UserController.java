package com.lec.spring.controller;

import com.lec.spring.config.PrincipalDetails;
import com.lec.spring.domain.User;
import com.lec.spring.domain.UserDTO;
import com.lec.spring.service.UserService;

import jakarta.validation.Valid;
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
    public ResponseEntity<?> register(@RequestBody UserDTO userDTO) {
        return new ResponseEntity<>(userService.register(userDTO), HttpStatus.OK);
    }

    @RequestMapping("/findId")
    public ResponseEntity<?> findIDPage() { return new ResponseEntity<>("OK", HttpStatus.OK);}

    @GetMapping("/findId/{name}")
    public ResponseEntity<?> findID(@PathVariable String name) {
        return new ResponseEntity<>(userService.Find(name) != null, HttpStatus.OK);}

    @RequestMapping("/findPw")
    public ResponseEntity<?> findPWPage() { return new ResponseEntity<>("OK", HttpStatus.OK);}

    @GetMapping("/findPw/{name}/{birth}")
    public ResponseEntity<?> findPW(@PathVariable String name, @PathVariable String birth) {
        return new ResponseEntity<>(userService.FindPassword(name,birth), HttpStatus.OK);}
    // 개인정보 수정
    @PostMapping("/resetPw/{id}/{password}")
    public ResponseEntity<?> resetPw(@PathVariable Long id, @PathVariable String newPassword)
    {
        return new ResponseEntity<>(userService.ResetPassword(id, newPassword),HttpStatus.OK);
    }
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