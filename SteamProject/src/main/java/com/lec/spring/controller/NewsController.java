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

    @GetMapping("/saveNews")
    public void saveNews() {
        newsService.saveNews();
    }

    @GetMapping("/findAllNews")
    public List<News> findAllNews() {
        return newsService.findAllNews();
    }

    @GetMapping("/findFiveNews")
    public Page<News> findFiveNews(@RequestParam int page, @RequestParam int size) {
        return newsService.findFiveNews(page, size);
    }
}
