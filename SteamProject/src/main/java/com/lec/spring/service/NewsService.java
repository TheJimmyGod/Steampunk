package com.lec.spring.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lec.spring.domain.Game;
import com.lec.spring.domain.News;
import com.lec.spring.repository.GameRepository;
import com.lec.spring.repository.NewsRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class NewsService {
    private final NewsRepository newsRepository;
    private final GameRepository gameRepository;
    private final ObjectMapper jacksonObjectMapper;

    public NewsService(NewsRepository newsRepository, GameRepository gameRepository, ObjectMapper jacksonObjectMapper) {
        this.newsRepository = newsRepository;
        this.gameRepository = gameRepository;
        this.jacksonObjectMapper = jacksonObjectMapper;
    }

    public void saveNews() {
        try {
            List<Game> games = gameRepository.findAll();
            for (Game game : games) {
                Long appId = game.getAppId();

                URL url = new URL("https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=" + appId + "&count=1&maxlength=5000&format=json");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();

                conn.setRequestMethod("GET");
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setDoOutput(true);

                int responseCode = conn.getResponseCode(); // 서버의 응답 코드를 가져옵니다.
                if (responseCode == HttpURLConnection.HTTP_OK) { // 응답 코드가 200(OK)일 경우
                    BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                    StringBuilder sb = new StringBuilder();
                    String line = null;

                    while ((line = br.readLine()) != null) {
                        sb.append(line);
                    }
                    br.close();

                    JsonNode rootNode = jacksonObjectMapper.readTree(sb.toString());
                    JsonNode appNodes = rootNode.path("appnews").path("newsitems");
                    if(appNodes.isEmpty()) continue;

                    if (appNodes.isArray()) {
                        News news = new News();

                        for (JsonNode appNode : appNodes) {
                            String title = appNode.path("title").asText();
                            String author = appNode.path("author").asText();
                            String content = appNode.path("contents").asText();
                            String date = appNode.path("date").asText();

                            System.out.printf("""
                                appid: %d
                                title: %s
                                author: %s
                                content: %s
                                date: %s
                                """, appId, title, author, content, date);

                            news.setTitle(title);
                            if (author.trim().isEmpty()) {
                                news.setAuthor("unknown");
                            } else {
                                news.setAuthor(author);
                            }
                            news.setGameName(game.getGameName());
                            news.setCapsuleImage(game.getCapsuleImage());
                            news.setIsFree(game.getIsFree());
                            news.setContent(content);
                            news.setDate(date);
                            news.setAppId(appId);

                            System.out.println("news : " + news);
                        }
                        newsRepository.save(news);
                        System.out.println(appId + " : 저장 성공!!!!!!!!!");
                    } else {
                        System.out.println("실패!!!!!!!!!!!!!!!!!!!");
                    }
                } else if (responseCode == HttpURLConnection.HTTP_FORBIDDEN) { // 응답 코드가 403(Forbidden)일 경우
                    System.out.println("403 Forbidden: Access to the resource is forbidden for appId " + appId);
                } else {
                    System.out.println("HTTP Error Code: " + responseCode + " for appId " + appId);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public News findNews(Long appId) {
        try {
            if(newsRepository.existsByAppId(appId)) {
                System.out.println("존재하는 뉴스 리턴");
                return newsRepository.findByAppId(appId);
            }

            URL url = new URL("https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid="+appId+"&count=1&maxlength=5000&format=json");
            System.out.println(url);
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
            JsonNode appNodes = rootNode.path("appnews").path("newsitems");

            if (appNodes.isArray()) {
                News news = new News();

                for (JsonNode appNode : appNodes) {

                    Long appid = appNode.path("appid").asLong();
                    String title = appNode.path("title").asText();
                    String author = appNode.path("author").asText();
                    String content = appNode.path("contents").asText();
                    String date = appNode.path("date").asText();

                    System.out.printf("""
                    appid: %d
                    title: %s
                    author: %s
                    content: %s
                    date: %s
                    """, appid, title, author, content, date);

                    news.setTitle(title);
                    if (author.trim().isEmpty()){
                        news.setAuthor("unknown");
                    } else news.setAuthor(author);
                    news.setGameName(gameRepository.findByAppId(appid).getGameName());
                    news.setCapsuleImage(gameRepository.findByAppId(appid).getCapsuleImage());
                    news.setContent(content);
                    news.setDate(date);
                    news.setAppId(appid);
                }
                System.out.println("존재하지 않는 뉴스 저장 후 리턴");
                return newsRepository.save(news);
            } else {
                System.out.println("실패!!!!!!!!!!!!!!!!!!!");
                return null;
            }

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    public List<News> findAllNews() {
        return newsRepository.findAll();
    }
    public Page<News> findAllNews(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "date"));
        return newsRepository.findAll(pageable);
    }
    public Page<News> findFreeNews(int page, int size){
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "date"));
        return newsRepository.findAllByIsFree(true, pageable);
    }

    public Page<News> findPaidNews(int page, int size){
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "date"));
        return newsRepository.findAllByIsFree(false, pageable);
    }
}
