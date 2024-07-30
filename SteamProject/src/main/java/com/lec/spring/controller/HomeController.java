package com.lec.spring.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/steam")
public class HomeController {
    // 이 사람이 로그인 했는가? 로그인 했다면 멤버인가 관리자인가

    @GetMapping("/")
    public String home() { return "Home";}

    // 추천게임 : http://store.steampowered.com/api/featured/

    // 금주의 차트 :
    // https://api.steampowered.com/ISteamChartsService/GetMostPlayedGames/v1/?key=2E0DEAF02393FA04974AFB40ADFAABD1
}
