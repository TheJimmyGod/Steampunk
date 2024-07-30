package com.lec.spring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class SteamProjectApplication {

    public static void main(String[] args) {
        SpringApplication.run(SteamProjectApplication.class, args);
    }

}
