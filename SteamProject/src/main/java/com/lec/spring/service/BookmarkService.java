package com.lec.spring.service;

import com.lec.spring.domain.Bookmark;
import com.lec.spring.domain.News;
import com.lec.spring.domain.User;
import com.lec.spring.repository.BookmarkRepository;
import com.lec.spring.repository.NewsRepository;
import com.lec.spring.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class BookmarkService {
    private final BookmarkRepository bookmarkRepository;
    private final NewsRepository newsRepository;
    private final UserRepository userRepository;

    public BookmarkService(BookmarkRepository bookmarkRepository,
                           UserRepository userRepository, NewsRepository newsRepository) {
        this.bookmarkRepository = bookmarkRepository;
        this.userRepository = userRepository;
        this.newsRepository = newsRepository;
    }

    @Transactional
    public Bookmark insert(User user, News news) {
        Bookmark bookmark = new Bookmark();
        bookmark.setUser(user);
        bookmark.setNews(news);

        user.addBookmark(bookmark);
        news.addBookmark(bookmark);
        return bookmarkRepository.save(bookmark);
    }

    @Transactional
    public String remove(Long bookmarkId){
        Bookmark bookmark = bookmarkRepository.findById(bookmarkId).orElse(null);
        if(bookmark == null)
            return "해당 북마크가 존재하지 않기 때문에, 북마크 제거 실패했습니다.";
        User user = bookmark.getUser();
        user.removeBookmark(bookmark);

        News news = bookmark.getNews();
        news.removeBookmark(bookmark);

        bookmarkRepository.delete(bookmark);
        return news.getGameName() + " 북마크 제거 완료";
    }

    @Transactional
    public List<Bookmark> findBookmarksByUserId(User user){
        return user.getBookmarks();
    }

    @Transactional
    public <T> List<Bookmark> findBookmarksBetweenTimelines(User user, String start, String end, T keyword){
        Long key = tryGetValue(keyword);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        LocalDate startDate = LocalDate.parse(start, formatter);
        LocalDate endDate = LocalDate.parse(end, formatter);

        LocalDateTime startTime = startDate.atStartOfDay();
        LocalDateTime endTime = endDate.atStartOfDay();

        List<Bookmark> bookmarks = findBookmarks(user.getId(), keyword);
        List<Bookmark> collect = new ArrayList<>();
        for(var bookmark : bookmarks)
        {
            long time = 0L;
            try {
                time = Long.parseLong(bookmark.getNews().getDate());
            } catch (NumberFormatException ex) {
                continue;
            }
            Instant instant = Instant.ofEpochSecond(time);
            LocalDateTime dateUTC = LocalDateTime.ofInstant(instant, ZoneId.of("UTC"));
            LocalDateTime dateTime = dateUTC.atZone(ZoneId.of("UTC")).withZoneSameInstant(ZoneId.of("Asia/Seoul")).toLocalDateTime();
            if(dateTime.isAfter(startTime) && dateTime.isBefore(endTime))
                collect.add(bookmark);
        }
        return collect;
    }

    @Transactional
    public <T> List<Bookmark> findBookmarks(Long userId, T keyword){
        Long appid = tryGetValue(keyword);
        List<Bookmark> collect = new ArrayList<>();
        if (isUserNull(userId)) return null;
        var list = bookmarkRepository.findAll().stream().filter(x-> Objects.equals(x.getUser().getId(), userId)).toList();
        if(appid > 0L)
        {
            for (Bookmark item : list)
            {
                if(appid.equals(item.getNews().getAppId()))
                    collect.add(item);
            }
        }
        else
        {
            if(((String)keyword).isEmpty() || ((String) keyword).equalsIgnoreCase("null"))
            {
                return bookmarkRepository.findAll().stream().filter(x -> Objects.equals(x.getUser().getId(), userId)).collect(Collectors.toList());
            }

            List<News> newsList = newsRepository.findNewsByGameNameContainingIgnoreCase((String)keyword);
            if(newsList == null || newsList.isEmpty())
                newsList = newsRepository.findNewsByTitleContainingIgnoreCase((String)keyword);
            for (Bookmark item : list)
            {
                for(News news : newsList)
                {
                    if(Objects.equals(item.getNews().getAppId(), news.getAppId()))
                        collect.add(item);
                }
            }
        }

        return collect;
    }

    @Transactional
    public <T> Bookmark findBookmark(Long userId, T keyword){
        Long appid = tryGetValue(keyword);
        if (isUserNull(userId)) return null;
        var list = bookmarkRepository.findAll().stream().filter(x-> Objects.equals(x.getUser().getId(), userId)).toList();
        if(appid > 0L)
        {
            for (Bookmark item : list)
            {
                if(appid.equals(item.getNews().getAppId()))
                    return item;
            }
        }
        else
        {
            if(((String)keyword).isEmpty() || ((String) keyword).equalsIgnoreCase("null"))
            {
                return null;
            }

            List<News> newsList = newsRepository.findNewsByGameNameContainingIgnoreCase((String)keyword);
            if(newsList == null || newsList.isEmpty())
                newsList = newsRepository.findNewsByTitleContainingIgnoreCase((String)keyword);
            for (Bookmark item : list)
            {
                for(News news : newsList)
                {
                    if(Objects.equals(item.getNews().getAppId(), news.getAppId()))
                        return item;
                }
            }
        }
        return null;
    }

    private boolean isUserNull(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        return user == null;
    }

    private static <T> Long tryGetValue(T keyword) {
        long appid = 0L;
        try {
            appid = Long.parseLong((String)keyword);
        } catch (NumberFormatException ex) {
            return appid;
        }
        return appid;
    }
}
