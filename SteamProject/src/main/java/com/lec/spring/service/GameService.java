package com.lec.spring.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lec.spring.domain.Game;
import com.lec.spring.repository.GameRepository;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class GameService {
    private final GameRepository gameRepository;
    private final ObjectMapper jacksonObjectMapper;


    public GameService(GameRepository gameRepository, ObjectMapper jacksonObjectMapper) {
        this.gameRepository = gameRepository;
        this.jacksonObjectMapper = jacksonObjectMapper;
    }

    public Game findByAppId(Long appId) {
        return gameRepository.findByAppId(appId);
    }

    public void saveGame() {
        try {
            URL url = new URL("https://api.steampowered.com/IStoreService/GetAppList/v1/?key=2E0DEAF02393FA04974AFB40ADFAABD1&max_results=10000");
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
            JsonNode appsNode = rootNode.path("response").path("apps");

            // 각 앱의 `appid`와 `name` 값 추출
            if (appsNode.isArray()) {
                for (JsonNode appNode : appsNode) {
                    long appid = appNode.path("appid").asLong();
                    String name = appNode.path("name").asText();

                    // 이미 저장된 appId인지 확인
                    Game existingGame = gameRepository.findByAppId(appid);
                    if (existingGame == null) {
                        Game g = new Game();
                        g.setAppId(appid);
                        g.setGameName(name);
                        gameRepository.save(g);
                    } else {
                        System.out.println("appId =" + appid + " 존재하는 appid 스킵.");
                    }
                }
            }
            System.out.println("appIds, gameName 저장완료 !!!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public void saveGameInfo(){
        try {
            List<Game> games = gameRepository.findAll();

            for (Game game : games) {

                Long id = game.getAppId();
                System.out.println("appid : " + id + "appid 찾기완료");
                if(id == null || id == 0L || id < 221100) continue;
                // if(id == null || id == 0L || id < 45300L) continue;
                // 중단했다가 이어가고 싶으면 id 값을 위처럼 처리 (appid = 45300 부터 저장하고 싶을때)

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
                        genreBuilder.append(",");
                    }
                    genreBuilder.append(description);
                }

                String developers = arrayNodeToString(developersNode);
                Long appid = appsNode.path("steam_appid").asLong();
                if (appid == null || appid == 0L) continue;  // success: false 일때 데이터 저장 패스(0이 들어감)

                String gameName = appsNode.path("name").asText();
                Boolean is_free = appsNode.path("is_free").asBoolean();
                String header_image = appsNode.path("header_image").asText();
                String capsule_image = appsNode.path("capsule_image").asText();
                String short_description = appsNode.path("short_description").asText();
                String minimum = appsNode.path("pc_requirements").path("minimum").asText();
                String pc_recommended = appsNode.path("pc_requirements").path("recommended").asText();
                String price = appsNode.path("price_overview").path("final_formatted").asText();
                Long discount = appsNode.path("price_overview").path("discount_percent").asLong();
                String website = appsNode.path("website").asText();
                String release_date = appsNode.path("release_date").path("date").asText();

                Game g = gameRepository.findByAppId(id);
//                g.setAppId(appid);
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

                gameRepository.save(g);
                System.out.println("appid : " + id + "게임 정보 저장");

                TimeUnit.SECONDS.sleep(2); // Sleep for 4 seconds between requests
            }
            System.out.println("모든 게임정보 저장완료!!!");

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
    public List<Game> getFeaturedGames() {
        try {
            List<Long> ids;
            URL url = new URL("https://store.steampowered.com/api/featured/");
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
            JsonNode appsNode = rootNode.path("featured_win");

            List<Long> idsList = new ArrayList<>();
            // 각 게임의 `id` 값 추출
            if (appsNode.isArray()) {
                for (JsonNode appNode : appsNode) {
                    long appid = appNode.path("id").asLong();

                    idsList.add(appid);
                    System.out.println("idsList 상태 : " + idsList.toString());
                }
            }
            System.out.println("idsList 로 추출완료");

            List<Game> gamesList = new ArrayList<>();
            for (Long id : idsList) {
                gamesList.add(gameRepository.findByAppId(id));
                System.out.println("gamesList 상태 : " + gamesList.toString());
            }
            return gamesList;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    public List<Game> getTestGames(){
        List<Game> gamesList = new ArrayList<>();
        for (Long i = 10L; i < 60L; i+=10L) {
            gamesList.add(gameRepository.findByAppId(i));
        }
        return gamesList;
    }
}
