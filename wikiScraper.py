import json
try:
    import urllib.request as urllib2
except ImportError:
    import urllib2
from bs4 import BeautifulSoup

with open('combinedRosterDraft.json') as data_file:
    comboJson = json.load(data_file);

nameArr = [];

for player in comboJson:
    names = player['name'].split(",");
    names[1] = names[1].replace(" ", "");
    name = names[1]+"_"+names[0];
    if '.' in names[1]:
        names[1]=names[1].replace(".", "._");
        name = names[1]+names[0];
    if "David_Johnson" in name:
        name=name+"_(running_back)";
    if "John_Brown" in name:
        name+="_(wide_receiver)";
    nameArr.append(name);

urlBase = "https://en.wikipedia.org/wiki/";
urlArr = [];

for name in nameArr:
    urlArr.append(urlBase+name);

for url in urlArr:
    page = urllib2.urlopen(url).read();
    soup = BeautifulSoup(page, "html.parser");
    table = soup.find("table", {"class":'infobox vcard'});
    tbody = table.find("tbody");

