package com.lec.spring.service;

import com.lec.spring.domain.Bookmark;
import com.lec.spring.domain.News;
import com.lec.spring.domain.User;
import com.lec.spring.repository.BookmarkRepository;
import com.lec.spring.repository.NewsRepository;
import com.lec.spring.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

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
        return "북마크 제거 완료";
    }

    @Transactional
    public List<Bookmark> findBookmarksByUserId(User user){
        return user.getBookmarks();
    }

    @Transactional
    public <T> List<Bookmark> find(Long userId, T keyword){
        Long appid = null;
        try
        {
            appid = Long.parseLong((String)keyword);
        }
        catch (NumberFormatException ex)
        {
            appid = 0L;
        }
        List<Bookmark> collect = new ArrayList<>();
        User user = userRepository.findById(userId).orElse(null);
        if(user == null)
            return null;
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
            List<News> newsList = newsRepository.findNewsByGameNameContainingIgnoreCase((String)keyword);
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
}
