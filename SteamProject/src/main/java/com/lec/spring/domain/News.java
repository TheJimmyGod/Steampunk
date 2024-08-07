package com.lec.spring.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name="S_News")
@Builder
public class News {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long appId;

    @Column(name = "is_free")
    private Boolean isFree;

    @Column
    private String gameName;

    @Column(name = "capsule_image")
    private String capsuleImage;

    @Column(length = 1000)
    private String title;

    private String author;

    @Column(length = 8000)
    private String content;

//    @JsonDeserialize(using= LocalDateTimeDeserializer.class)
//    @JsonSerialize(using= LocalDateTimeSerializer.class)
//    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private String date;

    @OneToMany
    @Builder.Default
    @JsonIgnore
    @JoinTable(
            name = "s_news_bookmarks",
            joinColumns = @JoinColumn(name = "news_id"),
            inverseJoinColumns = @JoinColumn(name = "bookmark_id")
    )
    @ToString.Exclude
    private List<Bookmark> bookmarks = new ArrayList<>();
    public void addBookmark(Bookmark bookmark) {this.bookmarks.add(bookmark);}
    public void removeBookmark(Bookmark bookmark) {this.bookmarks.remove(bookmark);}
}
