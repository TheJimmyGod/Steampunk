package com.lec.spring.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lec.spring.domain.Game;
import com.lec.spring.domain.GameDTO;
import com.lec.spring.repository.GameRepository;
import com.lec.spring.service.GameService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@RestController
@RequestMapping("/game")
public class GameController {

    private final ObjectMapper jacksonObjectMapper;
    private final GameService gameService;
    private final GameRepository gameRepository;

    public GameController(ObjectMapper jacksonObjectMapper, GameService gameService, GameRepository gameRepository) {
        this.jacksonObjectMapper = jacksonObjectMapper;
        this.gameService = gameService;
        this.gameRepository = gameRepository;
    }

    @GetMapping("/saveGameDTO")
    public void getJson(){
        try {
            URL url = new URL("https://api.steampowered.com/IStoreService/GetAppList/v1/?key=2E0DEAF02393FA04974AFB40ADFAABD1");
            HttpURLConnection conn = (HttpURLConnection)url.openConnection();

            conn.setRequestMethod("GET"); // http 메서드
            conn.setRequestProperty("Content-Type", "application/json"); // header Content-Type 정보
            conn.setDoOutput(true); // 서버로부터 받는 값이 있다면 true

            // 서버로부터 데이터 읽어오기
            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuilder sb = new StringBuilder();
            String line = null;

            while((line = br.readLine()) != null) { // 읽을 수 있을 때 까지 반복
                sb.append(line);
            }
            br.close();

            // JSON 응답 파싱
            JsonNode rootNode = jacksonObjectMapper.readTree(sb.toString());
            JsonNode appsNode = rootNode.path("response").path("apps");

            // 각 앱의 `appid`와 `name` 값 추출
            if (appsNode.isArray()) {
                for (JsonNode appNode : appsNode) {
                    long appid = appNode.path("appid").asLong();
                    String name = appNode.path("name").asText();
                    System.out.println("App ID: " + appid + ", Name: " + name);

                    GameDTO game = new GameDTO();
                    game.setId(appid);
                    game.setName(name);
                    gameService.saveGameDTO(game);

                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @GetMapping("/saveGame")
    public void getJsonG(){
        try {
            URL url = new URL("https://api.steampowered.com/IStoreService/GetAppList/v1/?key=2E0DEAF02393FA04974AFB40ADFAABD1");
            HttpURLConnection conn = (HttpURLConnection)url.openConnection();

            conn.setRequestMethod("GET"); // http 메서드
            conn.setRequestProperty("Content-Type", "application/json"); // header Content-Type 정보
            conn.setDoOutput(true); // 서버로부터 받는 값이 있다면 true

            // 서버로부터 데이터 읽어오기
            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuilder sb = new StringBuilder();
            String line = null;

            while((line = br.readLine()) != null) { // 읽을 수 있을 때 까지 반복
                sb.append(line);
            }
            br.close();

            // JSON 응답 파싱
            JsonNode rootNode = jacksonObjectMapper.readTree(sb.toString());
            JsonNode appsNode = rootNode.path("response").path("apps");

            // 각 앱의 `appid`와 `name` 값 추출
            if (appsNode.isArray()) {
                for (JsonNode appNode : appsNode) {
                    long appid = appNode.path("appid").asLong();
                    String name = appNode.path("name").asText();
                    System.out.println("App ID: " + appid + ", Name: " + name);

                    Game g = new Game();
                    g.setAppId(appid);
                    g.setGameName(name);
                    gameService.saveGame(g);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @GetMapping("/saveGame2")
    public void getJsonG2(){
        try {
            URL url = new URL("https://api.steampowered.com/IStoreService/GetAppList/v1/?key=2E0DEAF02393FA04974AFB40ADFAABD1");
            HttpURLConnection conn = (HttpURLConnection)url.openConnection();

            conn.setRequestMethod("GET"); // http 메서드
            conn.setRequestProperty("Content-Type", "application/json"); // header Content-Type 정보
            conn.setDoOutput(true); // 서버로부터 받는 값이 있다면 true

            // 서버로부터 데이터 읽어오기
            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuilder sb = new StringBuilder();
            String line = null;

            while((line = br.readLine()) != null) { // 읽을 수 있을 때 까지 반복
                sb.append(line);
            }
            br.close();

            // JSON 응답 파싱
            JsonNode rootNode = jacksonObjectMapper.readTree(sb.toString());
            JsonNode appsNode = rootNode.path("response").path("apps");

            // 각 앱의 `appid`와 `name` 값 추출
            if (appsNode.isArray()) {
                for (JsonNode appNode : appsNode) {
//                    long appid = appNode.path("appid").asLong();
//                    String name = appNode.path("name").asText();
                    String last_modified = appNode.path("last_modified").asText();

                    Game g = new Game();
                    g.setDevelopers(last_modified);
                    gameService.saveGame(g);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @GetMapping("/saveGameEx")
    public void getJsonG3(){
        try {
            List<Game> games = gameService.findAll();


            for (Game game : games) {

                Long id = game.getAppId();
                System.out.println(id);
                if(id == null || id == 0) continue;

                URL url = new URL("https://store.steampowered.com/api/appdetails/?appids=" + id);
                HttpURLConnection conn = (HttpURLConnection)url.openConnection();

                conn.setRequestMethod("GET"); // http 메서드
                conn.setRequestProperty("Content-Type", "application/json"); // header Content-Type 정보
                conn.setDoOutput(true); // 서버로부터 받는 값이 있다면 true

                // 서버로부터 데이터 읽어오기
                BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                StringBuilder sb = new StringBuilder();
                String line = null;

                while((line = br.readLine()) != null) { // 읽을 수 있을 때 까지 반복
                    sb.append(line);
                }
                br.close();

                // JSON 응답 파싱
                JsonNode rootNode = jacksonObjectMapper.readTree(sb.toString());
                JsonNode appsNode = rootNode.path(id.toString()).path("data");
                JsonNode developersNode = rootNode.path(id.toString()).path("data").path("developers");
                JsonNode genresNode = rootNode.path(id.toString()).path("data").path("genres");
                StringBuilder genreBuilder = new StringBuilder();

                for (JsonNode genreNode : genresNode) {
                    String description = genreNode.path("description").asText();

                    // 첫 번째 요소인지 확인하고 쉼표 처리
                    if (genreBuilder.length() > 0) {
                        genreBuilder.append(", ");
                    }
                    genreBuilder.append(description);
                }

                String developers = arrayNodeToString(developersNode);


                Long appid = appsNode.path("steam_appid").asLong();
                String gameName = appsNode.path("name").asText();
//                    String developers = appsNode.path("developers").asText();
//                    String developers = arrayNodeToString(developersNode);
                Boolean is_free = appsNode.path("is_free").asBoolean();
                String header_image = appsNode.path("header_image").asText();
                String capsule_image = appsNode.path("capsule_image").asText();
                String short_description = appsNode.path("short_description").asText();
                String minimum = appsNode.path("pc_requirements").path("minimum").asText();
                String pc_recommended = appsNode.path("pc_requirements").path("recommended").asText();
                String price = appsNode.path("price_overview").path("final_formatted").asText();
                Long discount = appsNode.path("price_overview").path("discount_percent").asLong();
//                String genre = appNode.path("genres").asText();
                String website = appsNode.path("website").asText();
                String release_date = appsNode.path("release_date").path("date").asText();

//                // 중복된 appId가 있는지 확인
//                Game existingGame = gameRepository.findByAppId(id);
//                if (existingGame != null) {
//                    System.out.println("Skipping game with duplicate appId: " + id);
//                    continue; // 중복된 경우, 다음 게임으로 이동
//                }

                Game g = gameRepository.findByAppId(id);
                g.setAppId(appid);
                g.setGameName(gameName);
                g.setDevelopers(developers);
                g.setIsFree(is_free);
                g.setHeaderImage(header_image);
                g.setCapsuleImage(capsule_image);
                g.setShortDescription(short_description);
                g.setMinimum(minimum);
                g.setRecommended(pc_recommended);
                g.setPrice(price);
                g.setPrice(price);
                g.setDiscount(discount);
                g.setGenres(genreBuilder.toString());
                g.setWebsite(website);
                g.setReleaseDate(release_date);

                gameService.saveGame(g);

                TimeUnit.SECONDS.sleep(1); // Sleep for 4 seconds between requests
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    private String arrayNodeToString(JsonNode arrayNode) {
        if (arrayNode.isArray()) {
            // 배열을 스트림으로 변환하고 각 요소를 문자열로 변환 후, 구분자로 연결
            return StreamSupport.stream(arrayNode.spliterator(), false)
                    .map(JsonNode::asText)
                    .collect(Collectors.joining(", "));
        }
        return "";
    }

}
