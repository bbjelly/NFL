import urllib2
from bs4 import BeautifulSoup

url = "http://www.nfl.com/draft/history/fulldraft?type=team"  # change to whatever your url is

page = urllib2.urlopen(url).read()
soup = BeautifulSoup(page)

table=soup.find( "table", {"class":"data-table1"} )

tbody=table.find("tbody");
i=0;
for row in tbody.findAll("td"):
	i+=1;
	print row.text.strip(),
	if(i%5==0):
		print

