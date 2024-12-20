import requests
from bs4 import BeautifulSoup

def construct_ballotpedia_url(state, district):
    
    state_formatted = state.replace(" ", "_")

   
    if state.endswith('s'):
        url = f"https://ballotpedia.org/{state_formatted}%27_{district}_Congressional_District_election,_2024"
    else:
        url = f"https://ballotpedia.org/{state_formatted}%27s_{district}_Congressional_District_election,_2024"
    
    return url

def scrape_house_candidates(state, district):
    ballotpedia_url = construct_ballotpedia_url(state, district)
    response = requests.get(ballotpedia_url)

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')

        candidates = []

        
        general_election_section = soup.find('h5', text=lambda t: 'general election' in t.lower())
        if general_election_section:
            results_table = general_election_section.find_next('table')
            if results_table:
                candidate_rows = results_table.find_all('tr', class_='results_row')[:2]  # First 2 candidates
                for row in candidate_rows:
                    candidate_name = row.find('a').get_text(strip=True)
                    candidate_link = row.find('a')['href']
                    candidate_party = row.find('td', class_='votebox-results-cell--text').get_text(strip=True)

                    candidates.append({
                        'name': candidate_name,
                        'party': candidate_party,
                        'link': f"https://ballotpedia.org{candidate_link}"
                    })
            else:
                print("No general election candidate information found.")
        else:
            print("No general election section found.")

        return candidates
    else:
        print(f"Failed to access {ballotpedia_url}")
        return []


