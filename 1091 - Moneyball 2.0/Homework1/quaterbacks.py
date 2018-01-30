import bs4 as bs
import urllib.request

class Quaterback:
    passer_ratings = []

    def __init__(self, name, passer_rating_list):
        self.name = name
        self.passer_ratings = passer_rating_list
        self.career_passer_rating = self.find_career_passer_rating()

    def find_career_passer_rating(self):
        return "{0:.2f}".format(float(self.passer_ratings[-1].text))

def parse_data(url):
    sauce = urllib.request.urlopen(url).read()
    soup = bs.BeautifulSoup(sauce, 'lxml')

    return soup.body.select('td[data-stat="pass_rating"]')

def main():
    ben = Quaterback("Ben Roethlisberger", parse_data('https://www.pro-football-reference.com/players/R/RoetBe00.htm'))
    terry = Quaterback("Terry Bradshaw", parse_data('https://www.pro-football-reference.com/players/B/BradTe00.htm'))

    if ben.career_passer_rating > terry.career_passer_rating:
        print("{} is better based on his career passer rating of: {}".format(ben.name, ben.career_passer_rating))
    else:
        print("{} is better based on his career passer rating of: {}".format(terry.name, terry.career_passer_rating))

if __name__ == "__main__":
    main()
		