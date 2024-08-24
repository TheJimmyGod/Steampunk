package com.lec.spring.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lec.spring.domain.Game;
import com.lec.spring.domain.Rank;
import com.lec.spring.repository.GameRepository;
import com.lec.spring.repository.RankRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

@Service
public class RankService {

    private final RankRepository rankRepository;
    private final GameRepository gameRepository;
    private final ObjectMapper jacksonObjectMapper;

    @PersistenceContext
    private EntityManager entityManager;

    public RankService(RankRepository rankRepository, GameRepository gameRepository, ObjectMapper jacksonObjectMapper) {
        this.rankRepository = rankRepository;
        this.gameRepository = gameRepository;
        this.jacksonObjectMapper = jacksonObjectMapper;
    }

//    @Scheduled(cron = "*/30 * * * * ?")  // 30초마다 실행
//    @Transactional
//    public void scheduledTask() {
//        // 1단계: 테이블 비우기 및 재생성
//        clearAndRecreateTable();
//
//        // 2단계: 데이터 저장
//        saveRank();
//    }

    @Transactional
    public void clearAndRecreateTable() {
        // 테이블 비우기 (데이터 삭제)
        rankRepository.deleteAll();

        // 테이블 구조 새로 생성하기 (기본적으로 JPA는 엔티티가 변경되면 자동으로 테이블을 업데이트합니다)
        // 별도의 작업이 필요 없을 수 있습니다. 그러나 특정 요구사항이 있다면 DB 마이그레이션 도구를 사용할 수 있습니다.
        System.out.println("테이블을 비우고 새로 생성했습니다.");
    }


    @Transactional
    public void saveRank() {
        try {
            BufferedReader br = getBr("https://api.steampowered.com/ISteamChartsService/GetGamesByConcurrentPlayers/v1/?key=2E0DEAF02393FA04974AFB40ADFAABD1");
            StringBuilder sb = new StringBuilder();
            String line = null;

            while ((line = br.readLine()) != null) {
                sb.append(line);
            }
            br.close();

            JsonNode rootNode = jacksonObjectMapper.readTree(sb.toString());
            JsonNode appsNode = rootNode.path("response").path("ranks");
            JsonNode appsNode2 = rootNode.path("response");

            if (appsNode.isArray()) {
                for (JsonNode appNode : appsNode) {
                    long rank = appNode.path("rank").asLong();
                    long concurrentInGame = appNode.path("concurrent_in_game").asLong();
                    long appId = appNode.path("appid").asLong();
                    long lastUpdate = appsNode2.path("last_update").asLong();

                    Rank existingRank = rankRepository.findByAppId(appId);
                    Game game = gameRepository.findByAppId(appId);

                    if (existingRank != null) {
                        existingRank.setRank(rank);
                        existingRank.setConcurrentInGame(concurrentInGame);
                        existingRank.setLastUpdate(lastUpdate);
                        if (game != null) {
                            existingRank.setGameName(game.getGameName());
                        }else
                        {
                            game = UnknownFileCheck(appId);
                            if(game != null)
                                existingRank.setGameName(game.getGameName());
                        }
                        rankRepository.save(existingRank);
                    } else {
                        Rank newRank = new Rank();
                        newRank.setAppId(appId);
                        newRank.setRank(rank);
                        newRank.setConcurrentInGame(concurrentInGame);
                        newRank.setLastUpdate(lastUpdate);
                        if (game != null) {
                            newRank.setGameName(game.getGameName());

                        } else {
                            game = UnknownFileCheck(appId);
                            if(game != null)
                                newRank.setGameName(game.getGameName());
                        }
                        rankRepository.save(newRank);
                    }
                }
            }

        } catch (Exception e) {
            System.err.println("Exception occurred while saving rank: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private Game UnknownFileCheck(long appId) throws IOException {
        BufferedReader br = getBr("https://store.steampowered.com/api/appdetails/?appids=" + appId);
        StringBuilder sb = new StringBuilder();
        String line2 = null;

        while((line2 = br.readLine()) != null) { // 읽을 수 있을 때 까지 반복
            sb.append(line2);
        }
        br.close();
        // JSON 응답 파싱
        JsonNode rootNode2 = jacksonObjectMapper.readTree(sb.toString());
        JsonNode appsNode3 = rootNode2.path(Long.toString(appId)).path("data");

        Long appid = appsNode3.path("steam_appid").asLong();
        String gameName = appsNode3.path("name").asText();
        System.out.println(appid + " 여기: " + gameName);
        if (appid == 0L)
        {
            return null;
        }

        Game g = new Game();
        g.setAppId(appid);
        g.setGameName(gameName);
        return gameRepository.save(g);
    }

    private static BufferedReader getBr(String appId) throws IOException {
        URL url_another = new URL(appId);
        HttpURLConnection conn_another = (HttpURLConnection) url_another.openConnection();

        conn_another.setRequestMethod("GET"); // http 메서드
        conn_another.setRequestProperty("Content-Type", "application/json"); // header Content-Type 정보
        conn_another.setDoOutput(true); // 서버로부터 받는 값이 있다면 true

        // 서버로부터 데이터 읽어오기
        BufferedReader br = new BufferedReader(new InputStreamReader(conn_another.getInputStream()));
        return br;
    }

    @Transactional
    public List<Rank> findAllRank() {

        return rankRepository.findAll();
    }

    @Transactional
    public List<Rank> findByRank() {
        List<Rank> ranks = new ArrayList<>();

        for (Long i = 1L; i <= 10L; i+= 1L) {

            ranks.add(rankRepository.findByRank(i));
            System.out.println(rankRepository.findByRank(i));
        }
        return ranks;
    }


}
