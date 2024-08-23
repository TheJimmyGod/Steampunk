package com.lec.spring.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ReactController {

    @GetMapping(value = {"/steam/**", "/TestMoon", "/steam/newsDetail/**"})  // 모든 React 라우트
    public String forward() {
        return "forward:/index.html";
    }
}
