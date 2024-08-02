package com.lec.spring.controller;

import com.lec.spring.domain.News;
import com.lec.spring.service.NewsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @GetMapping("/findAllNews")
    public List<News> findAllNews() {
        return newsService.findAllNews();
    }
}
