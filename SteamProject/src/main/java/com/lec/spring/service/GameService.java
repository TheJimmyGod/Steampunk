package com.lec.spring.service;

import com.lec.spring.repository.GameRepository;
import com.lec.spring.repository.NewsRepository;
import org.springframework.stereotype.Service;

@Service
public class GameService {
    private final GameRepository gameRepository;

    public GameService(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }
}
