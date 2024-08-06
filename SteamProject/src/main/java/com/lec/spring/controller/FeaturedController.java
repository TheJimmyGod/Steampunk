package com.lec.spring.controller;


import com.lec.spring.domain.Featured;
import com.lec.spring.service.FeaturedService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
public class FeaturedController {
    private final FeaturedService featuredService;

    @CrossOrigin
    @PostMapping("/featured")
    public ResponseEntity<?> save(@RequestBody Featured featured){

        return new ResponseEntity<>(featuredService.saveFeaturedGames(featured), HttpStatus.CREATED); // response code: 201
    }

    @CrossOrigin
    @GetMapping("/getFeatured")
    public ResponseEntity<?> findAll(){

        return new ResponseEntity<>(featuredService.findAll(), HttpStatus.OK);
    }

}
