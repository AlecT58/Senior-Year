import bs4 as bs
import urllib.request

sauce = urllib.request.urlopen('https://www.pro-football-reference.com/').read()
soup = bs.BeautifulSoup(sauce, 'lxml')

for p_tag in soup.find_all('option'):
    print(p_tag.text)
