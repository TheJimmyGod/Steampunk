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
    public void getJsonGameInfo(){
        gameService.saveGameInfo();
    }

    @GetMapping("/featuredGames")
    public List<Game> getFeaturedGames(){

        return null;
    }

    @GetMapping("/saveRank")
    public void getJsonRank() {
        try {
            URL url = new URL("https://api.steampowered.com/ISteamChartsService/GetGamesByConcurrentPlayers/v1/?key=2E0DEAF02393FA04974AFB40ADFAABD1");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();

            conn.setRequestMethod("GET"); // http 메서드
            conn.setRequestProperty("Content-Type", "application/json"); // header Content-Type 정보
            conn.setDoOutput(true); // 서버로부터 받는 값이 있다면 true

            // 서버로부터 데이터 읽어오기
            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuilder sb = new StringBuilder();
            String line = null;

            while ((line = br.readLine()) != null) { // 읽을 수 있을 때 까지 반복
                sb.append(line);
            }
            br.close();

            // JSON 응답 파싱
            JsonNode rootNode = jacksonObjectMapper.readTree(sb.toString());
            JsonNode appsNode = rootNode.path("response").path("ranks");
            JsonNode appsNode2 = rootNode.path("response");

            // 기존 순위 데이터 삭제
            rankService.deleteAllRanks(); // rankService에서 모든 순위 데이터를 삭제하는 메서드 호출

            // 각 앱의 `rank`와 `concurrentInGame` 값 추출
            if (appsNode.isArray()) {
                for (JsonNode appNode : appsNode) {

                    long rank = appNode.path("rank").asLong();
                    long concurrentInGame = appNode.path("concurrent_in_game").asLong();
                    long appId = appNode.path("appid").asLong();
                    long lastUpdate = appsNode2.path("last_update").asLong();

                    // appId로 Game 엔티티 찾기
                    Game game = gameService.findByAppId(appId);

                    if (game != null) {
                        Rank r2 = new Rank();
                        r2.setAppId(appId);
                        r2.setGameName(game.getGameName());
                        r2.setRank(rank);
                        r2.setConcurrentInGame(concurrentInGame);
                        r2.setLastUpdate(lastUpdate);
                        rankService.saveRank(r2);
                    } else {
                        // game이 null인 경우 처리
                        System.out.println("Game with appId " + appId + " not found. Skipping rank update.");
                    }
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
