package com.lec.spring.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lec.spring.domain.Game;
import com.lec.spring.domain.Rank;
import com.lec.spring.repository.GameRepository;
import com.lec.spring.service.GameService;
import com.lec.spring.service.RankService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@RestController
@RequestMapping("/game")
public class GameController {

    private final ObjectMapper jacksonObjectMapper;
    private final GameService gameService;
    private final RankService rankService;

    public GameController(ObjectMapper jacksonObjectMapper, GameService gameService, RankService rankService) {
        this.jacksonObjectMapper = jacksonObjectMapper;
        this.gameService = gameService;
        this.rankService = rankService;
    }

    // appId, name 전부 저장하는 코드
    @GetMapping("/saveGame")
    public void getJsonGame() {
        gameService.saveGame();
    }
  
    // appId 를 기반으로 detail 데이터를 가져와 모든 게임 db 업데이트 (saveGame 완료 후 실행)
    @GetMapping("/saveGameInfo")
    public void getJsonGameInfo() {
        gameService.saveGameInfo();
    }
  
    // 추천게임 appId 를 받아와서 그걸 토대로 Game 10개를 조회하고 해당 Game 객체들을 리턴 (saveGameInfo 완료 후 실행)
    @GetMapping("/featuredGames")
    public List<Game> getFeaturedGames(){
        return gameService.getFeaturedGames();
    }

    @GetMapping("/testGames")
    public List<Game> getTestGames(){
        return gameService.getTestGames();
    }

    @GetMapping("/findGame/{appId}")
    public Game findGame(@PathVariable Long appId) {
        return gameService.findGame(appId);
    }


}
