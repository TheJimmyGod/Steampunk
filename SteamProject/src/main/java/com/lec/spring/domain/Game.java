package com.lec.spring.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "S_Game")
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private Long appId;

    @Column
    private String gameName;

    @Column
    private String developers;
    // unknown

    @Column(name = "is_free")
    private Boolean isFree;

    @Column(name = "header_image")
    private String headerImage;

    @Column(name = "capsule_image")
    private String capsuleImage;

    @Column(name = "short_description", length = 2000)
    private String shortDescription;

    @Column(name = "minimum", length = 2000)
    private String minimum;

    @Column(name = "recommended", length = 2000)
    private String recommended;

    @Column(name = "price")
    private String price = "0";

    @Column(name = "discount")
    private Long discount;

    @Column(name = "genres")
    private String genres;

    @Column(name = "website", length = 2000)
    private String website;

    @Column(name = "release_date")
    private String releaseDate;
}
