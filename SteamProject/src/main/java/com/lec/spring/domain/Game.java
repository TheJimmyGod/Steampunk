package com.lec.spring.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "S_Game")
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private Long appId;

    @Column(length = 100)
    private String gameName;

    @Column(length = 100)
    private String developers;
    // unknown

    @Column(name = "is_free")
    private Boolean isFree;

    @Column(name = "header_image", length = 2000)
    private String headerImage;

    @Column(name = "capsule_image", length = 2000)
    private String capsuleImage;

    @Column(name = "short_description", length = 2000)
    private String shortDescription;

    @Column(name = "minimum", length = 2000)
    private String minimum;

    @Column(name = "recommended", length = 2000)
    private String recommended;

    @Column(name = "price")
    private String price;

    @Column(name = "discount")
    private Integer discount = 0;

    @Column(name = "genres", length = 1000)
    private String genres;

    @Column(name = "website", length = 1000)
    private String website;

    @Column(name = "release_date")
    private LocalDateTime releaseDate;
}
