CREATE VIEW Owned_TV_List AS 
SELECT TV.show_name, TV.episode, TV.genre, TV.price, Owned_TV.user_id
FROM TV JOIN Owned_TV ON TV.id=Owned_TV.tv_id