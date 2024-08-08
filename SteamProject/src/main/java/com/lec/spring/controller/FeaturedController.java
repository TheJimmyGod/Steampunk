package com.lec.spring.controller;


import com.lec.spring.domain.Featured;
import com.lec.spring.domain.Game;
import com.lec.spring.service.FeaturedService;
import com.lec.spring.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@RestController
public class FeaturedController {
    private final FeaturedService featuredService;
    private final GameService gameService;

    @CrossOrigin
    @PostMapping("/featured")
    public ResponseEntity<?> save(@RequestBody Featured featured){
        Game game = gameService.findGame(featured.getGame().getAppId());
        if(game == null)
            return new ResponseEntity<>("존재하지 않는 게임: " + featured.getGame().getGameName(), HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(featuredService.saveFeaturedGames(game,featured), HttpStatus.CREATED); // response code: 201
    }
    @CrossOrigin
    @PostMapping("/updateFeatured")
    public ResponseEntity<?> updateFeatures(@RequestBody Game[] games){
        List<Game> gameList = new ArrayList<>();
        for(var game : games)
        {
            Game _game = gameService.findGame(game.getAppId());
            if(_game == null)
                return new ResponseEntity<>("존재하지 않는 게임", HttpStatus.BAD_REQUEST);
            if(_game.getFeatured().isEmpty())
                gameList.add(_game);
        }

        return new ResponseEntity<>(featuredService.updateFeatured(gameList), HttpStatus.CREATED);
    }

    @CrossOrigin
    @GetMapping("/getFeatured")
    public ResponseEntity<?> findAll(){
        return new ResponseEntity<>(featuredService.findAll(), HttpStatus.OK);
    }

    @CrossOrigin
    @DeleteMapping("/removeFeatured/{appId}")
    public ResponseEntity<?> remove(@PathVariable Long appId)
    {
        if(appId < 0L)
            return new ResponseEntity<>("올바르지 않는 AppID 입니다", HttpStatus.BAD_REQUEST);
        Featured featured = featuredService.findByAppId(appId);
        if(featured == null)
            return new ResponseEntity<>("존재하지 않는 AppID 입니다", HttpStatus.BAD_REQUEST);

        return new ResponseEntity<>(featuredService.removeFeatured(featured),HttpStatus.OK);
    }
}
