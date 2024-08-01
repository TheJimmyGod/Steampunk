package com.lec.spring.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lec.spring.domain.Game;
import com.lec.spring.domain.Rank;
import com.lec.spring.repository.GameRepository;
import com.lec.spring.service.GameService;
import com.lec.spring.service.RankService;
import org.springframework.web.bind.annotation.GetMapping;
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

    @GetMapping("/saveGame")
    public void getJsonGame() {
        gameService.saveGame();
    }

    @GetMapping("/saveGameInfo")
    public void getJsonGameInfo() {
        gameService.saveGameInfo();
    }

    @GetMapping("/featuredGames")
    public List<Game> getFeaturedGames() {
        return null;
    }

    @GetMapping("/saveRank")
    public void getJsonRank() {
        rankService.saveRank();
    }
}
