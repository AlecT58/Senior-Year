CREATE VIEW Owned_Music_List AS 
SELECT Music.song_name, Music.artist, Music.album, Music.price, Owned_Music.user_id
FROM Music JOIN Owned_Music ON Music.id=Owned_Music.music_id