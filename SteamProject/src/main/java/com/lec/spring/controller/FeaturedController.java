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
    @PostMapping("/updateFeature/{appId}")
    public ResponseEntity<?> updateFeature(@PathVariable Long appId){
        Game game = gameService.findGame(appId);
        if(game == null)
            return new ResponseEntity<>("존재하지 않는 게임입니다.", HttpStatus.BAD_REQUEST);

        if(featuredService.count() > 10)
        {
            return new ResponseEntity<>("추천 게임 한도 초과입니다.", HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(featuredService.saveFeaturedGame(game), HttpStatus.CREATED); // response code: 201
    }

    @CrossOrigin
    @PostMapping("/updateFeatures")
    public ResponseEntity<?> updateFeatures(@RequestBody Game[] games){
        List<Game> gameList = new ArrayList<>();
        if(featuredService.count() + games.length > 10)
        {
            return new ResponseEntity<>("추천 게임 한도 초과입니다." + featuredService.count() + games.length, HttpStatus.BAD_REQUEST);
        }
        for(var game : games)
        {
            Game _game = gameService.findGame(game.getAppId());
            if(_game == null)
                return new ResponseEntity<>("존재하지 않는 게임", HttpStatus.BAD_REQUEST);
            if(_game.getFeatured().isEmpty())
                gameList.add(_game);
        }

        return new ResponseEntity<>(featuredService.saveFeaturedGames(gameList), HttpStatus.CREATED);
    }

    @CrossOrigin
    @GetMapping("/getFeatured")
    public ResponseEntity<?> findAll(){
        return new ResponseEntity<>(featuredService.findAll(), HttpStatus.OK);
    }

    @CrossOrigin
    @GetMapping("/getRandomFeatured")
    public ResponseEntity<?> findRandom(){
        return new ResponseEntity<>(featuredService.findRandom(), HttpStatus.OK);
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
