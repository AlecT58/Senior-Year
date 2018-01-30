import bs4 as bs
import urllib.request as req

class Quarterback:
    def __init__(self, name, reg_season_url, post_season_url):
        self.name = name
        self.reg_season_url = reg_season_url
        self.post_season_url = post_season_url
        self.parse_pro_football_reference()
        self.calculate_career_passer_ratings()

    #Use BeautifulSoup 4 to read the HTML, parse the file, and locate the cells with pass_rating statistics
    def parse_pro_football_reference(self):
        sauce_reg = req.urlopen(self.reg_season_url).read()
        sauce_post = req.urlopen(self.post_season_url).read()
        soup_reg = bs.BeautifulSoup(sauce_reg, 'lxml')
        soup_post = bs.BeautifulSoup(sauce_post, 'lxml')

        self.passer_ratings_reg = soup_reg.body.select('td[data-stat="pass_rating"]')
        self.passer_ratings_post = soup_post.body.select('td[data-stat="pass_rating"]')

    #Find the career passer ratings for the regualr season and post season from the list of all passer ratings
    def calculate_career_passer_ratings(self):
        self.reg_season_rating = "{0:.2f}".format(float(self.passer_ratings_reg[-1].text))
        self.post_season_rating = "{0:.2f}".format(float(self.passer_ratings_post[-1].text))

    #Compare two QBs, printing which has the better regular and post season ratings
    def compare_passer_ratings(self, other_qb):
        if self.reg_season_rating > other_qb.reg_season_rating:
            print("[Reg. Season] {} is better based on his career passer rating of: {}".format(self.name, self.reg_season_rating))
        else:
            print("[Reg. Season] {} is better based on his career passer rating of: {}".format(other_qb.name, other_qb.reg_season_rating))

        if self.post_season_rating > other_qb.post_season_rating:
            print("[Post Season] {} is better based on his career passer rating of: {}".format(self.name, self.post_season_rating))
        else:
            print("[Post Season] {} is better based on his career passer rating of: {}".format(other_qb.name, other_qb.post_season_rating))

def main():
    ben = Quaterback("Ben Roethlisberger", 'https://www.pro-football-reference.com/players/R/RoetBe00.htm', 'https://www.pro-football-reference.com/players/R/RoetBe00/gamelog/post/')
    terry = Quaterback("Terry Bradshaw", 'https://www.pro-football-reference.com/players/B/BradTe00.htm', 'https://www.pro-football-reference.com/players/B/BradTe00/gamelog/post/')

    ben.compare_passer_ratings(terry)

if __name__ == "__main__":
    main()
		