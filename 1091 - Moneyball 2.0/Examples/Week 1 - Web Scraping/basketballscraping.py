# Oliver's four factors: 
# 1. Turnover rate
# 2. Offensive rebound rate
# 3. Effective field goals = (2pointers + 1.5 * 3pointers) / number of attempts
# 4. Free throw made / field goal attempt

import urllib.request as req
import bs4 as bs

sauce = req.urlopen('https://www.basketball-reference.com/friv/dailyleaders.cgi?month=01&day=10&year=2018.html').read()
soup = bs.BeautifulSoup(sauce, 'lxml')
body = soup.find('body')

players = body.select('td[data-stat="player"]')
free_throws = body.select('td[data-stat="ft_pct"]')
player_stats = zip(players, free_throws)

for stats in player_stats:
    if not stats[1].text:
        print(str(stats[0].text) + ": N/A")
    else: 
        print(str(stats[0].text) + ": " + str(stats[1].text))
