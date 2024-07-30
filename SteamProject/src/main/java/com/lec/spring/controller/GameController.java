package com.lec.spring.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

@RestController
@RequestMapping("/game")
public class GameController {

    private final ObjectMapper jacksonObjectMapper;

    public GameController(ObjectMapper jacksonObjectMapper) {
        this.jacksonObjectMapper = jacksonObjectMapper;
    }

    @GetMapping("/save")
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
                }
            }

//            System.out.println(sb);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
