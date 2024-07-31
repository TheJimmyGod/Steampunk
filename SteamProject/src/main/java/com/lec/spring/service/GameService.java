package com.lec.spring.service;

import com.lec.spring.domain.Game;
import com.lec.spring.domain.GameDTO;
import com.lec.spring.repository.GameDTORepository;
import com.lec.spring.repository.GameRepository;
import com.lec.spring.repository.NewsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GameService {
    private final GameRepository gameRepository;
    private final GameDTORepository gameDTORepository;

    public GameService(GameRepository gameRepository, GameDTORepository gameDTORepository) {
        this.gameRepository = gameRepository;
        this.gameDTORepository = gameDTORepository;
    }

    public Game saveGame(Game game) {
        return gameRepository.save(game);
    }

    public GameDTO saveGameDTO(GameDTO gameDTO) {
        return gameDTORepository.save(gameDTO);
    }

    public List<Game> findAll(){
        return gameRepository.findAll();
    }
    public Game findByAppId(Long appId) {
        return gameRepository.findByAppId(appId);
    }
}
