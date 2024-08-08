package com.lec.spring.controller;

import com.lec.spring.domain.News;
import com.lec.spring.domain.User;
import com.lec.spring.service.BookmarkService;
import com.lec.spring.service.NewsService;
import com.lec.spring.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@RequiredArgsConstructor
@RestController
@RequestMapping("/steam")
public class BookmarkController {
    private final UserService userService;
    private final BookmarkService bookmarkService;
    private final NewsService newsService;

    @PostMapping("/bookmark/insert/{userId}/{appId}")
    public ResponseEntity<?> insert(@PathVariable Long userId, @PathVariable Long appId)
    {
        User user = userService.findById(userId);
        if(user == null)
            return new ResponseEntity<>("존재하지 않는 유저입니다.", HttpStatus.BAD_REQUEST);
        News news = newsService.findNews(appId);
        if(news == null)
            return new ResponseEntity<>(  appId+ " 뉴스가 존재하지 않습니다.", HttpStatus.BAD_REQUEST);
        for(var item : user.getBookmarks())
        {
            if(Objects.equals(item.getNews().getAppId(), appId))
            {
                return new ResponseEntity<>("이미 존재하는 북마크입니다.", HttpStatus.BAD_REQUEST);
            }
        }
        return new ResponseEntity<>(bookmarkService.insert(user, news), HttpStatus.CREATED);
    }

    @DeleteMapping("/bookmark/remove/{bookmarkId}")
    public ResponseEntity<?> remove(@PathVariable Long bookmarkId)
    {
        return new ResponseEntity<>(bookmarkService.remove(bookmarkId), HttpStatus.OK);
    }

    @GetMapping("/bookmark/list/{userId}")
    public ResponseEntity<?> list(@PathVariable Long userId){
        User user = userService.findById(userId);
        if(user == null)
            return new ResponseEntity<>( userId + "는 존재하지 않는 유저입니다",HttpStatus.BAD_REQUEST);
        if(user.getBookmarks() == null)
            return new ResponseEntity<>("존재하지 않는 북마크!", HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(bookmarkService.findBookmarksByUserId(user), HttpStatus.OK);
    }

    @GetMapping("/bookmark/finds/{userId}/{keyword}")
    public <T> ResponseEntity<?> findBookmarks(@PathVariable Long userId, @PathVariable T keyword){
        return new ResponseEntity<>(bookmarkService.findBookmarks(userId, keyword), HttpStatus.OK);
    }
    @GetMapping("/bookmark/find/{userId}/{keyword}")
    public <T> ResponseEntity<?> findBookmark(@PathVariable Long userId, @PathVariable T keyword){
        return new ResponseEntity<>(bookmarkService.findBookmark(userId, keyword), HttpStatus.OK);
    }
}
