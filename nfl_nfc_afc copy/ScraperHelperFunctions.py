try:
    import urllib.request as urllib2
except ImportError:
    import urllib2
from bs4 import BeautifulSoup
import pdb

"""
Function to create dictionary mapping from NFL team names to their corresponding abbreviations
"""
def mapTeamNameToExtraInfo():
    team_url = "http://www.nfl.com/teams"
    page = urllib2.urlopen(team_url).read()
    soup = BeautifulSoup(page, "html.parser")
    teamGrid = soup.find("div", {"id": "col1"})
    afc = teamGrid.find("div", {"class": "col-one"})
    nfc = teamGrid.find("div", {"class": "col-two"})

    afcTeams = afc.findAll("div", {"class": "title"})
    nfcTeams = nfc.findAll("div", {"class": "title"})

    teamExtraInfos = {}
    for iTeam in xrange(len(afcTeams)): # afc and nfc have same number of teams
        afcName, afcAbbr = _getTeamNameAbbr(afcTeams[iTeam])
        nfcName, nfcAbbr = _getTeamNameAbbr(nfcTeams[iTeam])

        afcExtraInfo = {"abbr": afcAbbr, "division": "AFC"}
        nfcExtraInfo = {"abbr": nfcAbbr, "division": "NFC"}

        teamExtraInfos[afcName] = afcExtraInfo
        teamExtraInfos[nfcName] = nfcExtraInfo
    return teamExtraInfos

def _getTeamNameAbbr(teamGroup):
    teamUrl = teamGroup.find("a").get("href")
    teamName = teamGroup.contents[0].text
    teamAbbr = teamUrl.split("=")[1]
    return teamName, teamAbbr