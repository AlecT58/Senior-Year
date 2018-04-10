CREATE VIEW Owned_Movie_List AS 
SELECT Movie.movie_name, Movie.director, Movie.genre, Movie.price 
FROM Movie JOIN Owned_Movies ON Movie.id=Owned_Movies.movie_id