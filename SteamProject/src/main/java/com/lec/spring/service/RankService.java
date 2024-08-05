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

    @Scheduled(cron = "*/30 * * * * ?")  // 30초마다 실행
    @Transactional
    public void scheduledTask() {
        // 1단계: 테이블 비우기 및 재생성
        clearAndRecreateTable();

        // 2단계: 데이터 저장
        saveRank();
    }

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
            URL url = new URL("https://api.steampowered.com/ISteamChartsService/GetGamesByConcurrentPlayers/v1/?key=2E0DEAF02393FA04974AFB40ADFAABD1");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();

            conn.setRequestMethod("GET");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);

            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
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
                            newRank.setGameName("Unknown");
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
