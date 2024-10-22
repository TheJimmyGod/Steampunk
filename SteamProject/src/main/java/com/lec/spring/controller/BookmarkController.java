package com.lec.spring.controller;

import com.lec.spring.domain.News;
import com.lec.spring.domain.User;
import com.lec.spring.service.BookmarkService;
import com.lec.spring.service.NewsService;
import com.lec.spring.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/steam")
public class BookmarkController {
    public BookmarkController(@Lazy UserService userService, BookmarkService bookmarkService, NewsService newsService) {
        this.userService = userService;
        this.bookmarkService = bookmarkService;
        this.newsService = newsService;
    }

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

    @GetMapping("/bookmark/list/{userId}/{start}/{end}/{keyword}")
    public <T> ResponseEntity<?> listByTime(@PathVariable Long userId,
                                                 @PathVariable String start,
                                                 @PathVariable String end,
                                            @PathVariable T keyword)
    {
        User user = userService.findById(userId);
        if(user == null)
            return new ResponseEntity<>("존재하지 않는 유저", HttpStatus.BAD_REQUEST);
        if(start == null || start.isEmpty())
            return new ResponseEntity<>("시작 시간이 존재하지 않음", HttpStatus.BAD_REQUEST);
        String REGEX = "^[0-9]{4}[-][0-9]{2}[-][0-9]{2}$";
        Matcher matcher = Pattern.compile(REGEX).matcher(start);
        if(!matcher.matches())
            return new ResponseEntity<>("잘못된 시작 시간 양식", HttpStatus.BAD_REQUEST);
        if(end == null || end.isEmpty())
            return new ResponseEntity<>("시작 시간이 존재하지 않음", HttpStatus.BAD_REQUEST);
        matcher = Pattern.compile(REGEX).matcher(end);
        if(!matcher.matches())
            return new ResponseEntity<>("잘못된 끝 시간 양식", HttpStatus.BAD_REQUEST);

        return new ResponseEntity<>(bookmarkService.findBookmarksBetweenTimelines(user, start, end, keyword), HttpStatus.OK);
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
