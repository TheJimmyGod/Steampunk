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

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Objects;


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
    public ResponseEntity<?> findPW(@PathVariable String name, @PathVariable String birth) throws ParseException {
        if(name.isEmpty() || userService.Find(name) == null)
            return new ResponseEntity<>("아이디가 존재하지 않습니다.", HttpStatus.BAD_REQUEST);
        if(birth.isEmpty())
            return new ResponseEntity<>("생년월일이 존재하지 않습니다.", HttpStatus.BAD_REQUEST);
        if(birth.length() <= 8) // ########
        {
            SimpleDateFormat originFormat = new SimpleDateFormat("yyyyMMdd");
            var time = originFormat.parse(birth);
            SimpleDateFormat dtFormat = new SimpleDateFormat("yyyy-MM-dd");
            birth = dtFormat.format(time);
        }
        if(!Objects.equals(userService.Find(name).getBirth(), birth))
            return new ResponseEntity<>("생년월일이 존재하지 않거나 일치하지 않습니다.", HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(userService.FindPassword(name,birth), HttpStatus.OK);}
    // 개인정보 수정
    @PostMapping("/resetPw/{id}/{password}")
    public ResponseEntity<?> resetPw(@PathVariable Long id, @PathVariable String password)
    {
        if(password.length() < 4 || password.length() > 8)
            return new ResponseEntity<>("패스워드 양식이 올바르지 않습니다.", HttpStatus.BAD_REQUEST);
        if(userService.findById(id) == null)
            return new ResponseEntity<>("존재하지 않는 유저입니다.", HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(userService.ResetPassword(id, password),HttpStatus.OK);
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