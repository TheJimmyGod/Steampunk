package com.lec.spring.controller;


import com.lec.spring.domain.Featured;
import com.lec.spring.domain.Game;
import com.lec.spring.service.FeaturedService;
import com.lec.spring.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
public class FeaturedController {
    private final FeaturedService featuredService;
    private final GameService gameService;

    @CrossOrigin
    @PostMapping("/featured")
    public ResponseEntity<?> save(@RequestBody Featured featured){
        Game game = gameService.findGame(featured.getAppId());
        if(game == null)
            return new ResponseEntity<>("존재하지 않는 게임: " + featured.getGameName(), HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(featuredService.saveFeaturedGames(featured), HttpStatus.CREATED); // response code: 201
    }

    @CrossOrigin
    @GetMapping("/getFeatured")
    public ResponseEntity<?> findAll(){

        return new ResponseEntity<>(featuredService.findAll(), HttpStatus.OK);
    }

    @CrossOrigin
    @PutMapping("/updateFeatured")
    public ResponseEntity<?> update(@RequestBody Featured[] features){
        for(var f : features)
        {
            Game game = gameService.findGame(f.getAppId());
            if(game == null)
                return new ResponseEntity<>("존재하지 않는 게임: " + f.getGameName(), HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(featuredService.updateFeatured(features), HttpStatus.OK);
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
