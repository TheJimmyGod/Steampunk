package com.lec.spring.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@Builder
@Entity(name = "S_User")
public class User extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    @JsonIgnore
    private String password;

    @Transient
    @JsonIgnore
    @ToString.Exclude
    @Column(nullable = false)
    private String re_password;

    @Column(nullable = false)
    private String address_main;

    @Column(nullable = false)
    private String address_sub;

    @Column(nullable = false)
    private String birth;


    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "s_user_authorities",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "authority_id")
    )
    @Builder.Default
    private List<Authority> authorities = new ArrayList<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @Builder.Default
    @JsonIgnore
    @ToString.Exclude
    private List<Game> games = new ArrayList<>();

    @OneToMany
    @Builder.Default
    @JsonIgnore
    @JoinTable(
            name = "s_user_bookmarks",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "bookmark_id")
    )
    @ToString.Exclude
    private List<Bookmark> bookmarks = new ArrayList<>();

    public void addAuthorities(Authority... authorities) {
        Collections.addAll(this.authorities,authorities);
    }

    public void addBookmark(Bookmark bookmark) {this.bookmarks.add(bookmark);}
    public void removeBookmark(Bookmark bookmark) {this.bookmarks.remove(bookmark);}

    // OAuth2 Client
    private String provider;
    private String providerId;
}
