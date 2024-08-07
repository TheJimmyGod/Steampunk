package com.lec.spring.controller;

import com.lec.spring.domain.News;
import com.lec.spring.service.NewsService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/news")
public class NewsController {

    private final NewsService newsService;

    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    @GetMapping("/findNews/{appId}")
    public News getJsonGame(@PathVariable Long appId) {
        return newsService.findNews(appId);
    }
    // 뉴스 저장용
    @GetMapping("/saveNews")
    public void saveNews() {
        newsService.saveNews();
    }

    // 처음 뉴스들 뽑을 때 쓰던거 이제 안씀 혹시 몰라서 남김
    @GetMapping("/findNews")
    public List<News> findAllNews() {
        return newsService.findAllNews();
    }

    // 무한 스크롤 '전체' 선택일 경우
    @GetMapping("/findNews/all")
    public Page<News> findAllNews(@RequestParam int page, @RequestParam int size) {
        return newsService.findAllNews(page, size);
    }

    // 무한 스크롤 '무료' 선택일 경우
    @GetMapping("/findNews/free")
    public Page<News> findFreeNews(@RequestParam int page, @RequestParam int size) {
        return newsService.findFreeNews(page, size);
    }

    // 무한 스크롤 '유료' 선택일 경우
    @GetMapping("/findNews/paid")
    public Page<News> findPaidNews(@RequestParam int page, @RequestParam int size) {
        return newsService.findPaidNews(page, size);
    }
}
