import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Grid, Card, CardContent, CardMedia, CardActions, CircularProgress } from '@mui/material';
import axios from 'axios';
import '../App.css';
import EmailSignup from '../Components/EmailSignup';

const Homepage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch U.S. election news from non-paywalled sources using NewsAPI
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const apiKey = process.env.REACT_APP_NEWS_API_KEY;

        // List of neutral, non-paywalled, reputable sources for U.S. election news
        const nonPaywalledSources = [
          'reuters', 
          'associated-press', 
          'npr', 
          'usa-today', 
          'axios', 
          'the-hill', 
          'abc-news',
          'cbs-news',
          'msnbc',
          'newsweek',
          'propublica',
          'marketwatch'
        ].join(',');

        // API request for US election news from trusted, non-paywalled sources
        const response = await axios.get(
          `https://newsapi.org/v2/everything?q="us+elections"&language=en&sortBy=publishedAt&sources=${nonPaywalledSources}&apiKey=${apiKey}`
        );

        // Filter to remove duplicates based solely on titles
        const uniqueArticles = [];
        const seenTitles = new Set();

        response.data.articles.forEach((article) => {
          if (!seenTitles.has(article.title) && uniqueArticles.length < 6) {
            seenTitles.add(article.title);
            uniqueArticles.push(article);
          }
        });

        setNews(uniqueArticles);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="homepage" style={{ display: 'flex', justifyContent: 'center' }}>
      <div>
        <video className="background-video" autoPlay loop muted>
          <source src="/videos/home_background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay"></div>
      </div>

      <div className="content-container">
        <Container maxWidth="lg" sx={{ paddingTop: '50px' }}>
          <Box sx={{ textAlign: 'center', marginBottom: '50px' }}>
            <Typography variant="h2" component="h1" gutterBottom>
              Welcome to CivicCompass
            </Typography>
            <Typography variant="h6" color="white" paragraph>
              Stay updated with the latest U.S. election information, political news, and voting locations.
            </Typography>
            <EmailSignup />
          </Box>

          <Box>
            <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', marginBottom: '30px' }}>
              Latest U.S. Election News
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={4}>
                {news.map((article, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardMedia
                        component="img"
                        height="160"
                        image={article.urlToImage ? article.urlToImage : 'https://via.placeholder.com/300x200'}
                        alt={article.title}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                          {article.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ marginBottom: '10px' }}>
                          {article.description ? article.description.slice(0, 100) + '...' : 'No description available.'}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button 
                          size="small" 
                          color="primary" 
                          href={article.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          Read More
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>

          <Box sx={{ textAlign: 'center', marginTop: '50px', marginBottom: '50px' }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Ready to Participate in the Election?
            </Typography>
            <Button variant="contained" color="secondary" size="large" component="a" href="https://www.whenweallvote.org/" target="_blank" rel="noopener noreferrer">
              Get Involved Now
            </Button>

          </Box>
        </Container>
      </div>
    </div>
  );
};

export default Homepage;