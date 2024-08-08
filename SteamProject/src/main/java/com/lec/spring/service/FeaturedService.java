package com.lec.spring.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lec.spring.domain.Featured;
import com.lec.spring.domain.Game;
import com.lec.spring.repository.FeaturedRepository;
import com.lec.spring.repository.GameRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@RequiredArgsConstructor
@Service
public class FeaturedService {
    private final FeaturedRepository featuredRepository;
    private final GameRepository gameRepository;
    @Transactional
    public Featured saveFeaturedGames (Game game, Featured featured) {
        game.addFeature(featured);
        featured.setGame(game);
        gameRepository.save(game);
        return featuredRepository.save(featured);}

    @Transactional
    public boolean updateFeatured (List<Game> games) {
        if(games.isEmpty())
            return false;
        for (var game : games)
        {
            Featured feature = new Featured();
            feature.setGame(game);
            game.addFeature(feature);
            featuredRepository.saveAndFlush(feature);
        }
        return true;
    }


    @Transactional
    public List<Featured> findAll () {return featuredRepository.findAll();}

    @Transactional
    public String removeFeatured(Featured app){
        Game game = app.getGame();
        String name = game.getGameName();
        game.removeFeature(app);

        featuredRepository.delete(app);
        return name + " 가 삭제되었습니다.";
    }

    public Featured findByAppId(Long appId) {
        var list = featuredRepository.findAll();
        for(var item : list)
        {
            if(Objects.equals(item.getGame().getAppId(), appId)){
                return item;
            }
        }
        return null;
    }
}
