import requests
from bs4 import BeautifulSoup


def scrape_voter_info(state_name):
    
    state_formatted = state_name.replace(" ", "_")
    url = f"https://ballotpedia.org/{state_formatted}_State_Senate_elections,_2024"

    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')

        voter_info = []

        
        widget_rows = soup.find_all('div', class_='vis_widget_row')

        
        for row in widget_rows:
            desc = row.find('div', class_='vis_widget_desc')
            value = row.find('div', class_='vis_widget_value')

            if desc and value:
                desc_text = desc.get_text(strip=True)
                value_text = value.get_text(" | ", strip=True)  
                voter_info.append({desc_text: value_text})

        return voter_info
    else:
        print(f"Failed to access {url}")
        return []

def scrape_senate_candidates(state_name):
    
    state_formatted = state_name.replace(" ", "_")
    url = f"https://ballotpedia.org/United_States_Senate_election_in_{state_formatted},_2024"

    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')

        candidates = []

        
        headers = soup.find_all('h5', class_='votebox-header-election-type')
        found_general_election = False

        for header in headers:
            if 'general election' in header.get_text(strip=True).lower():
                found_general_election = True
                results_table = header.find_next('table')
                if results_table:
                    
                    candidate_rows = results_table.find_all('tr', class_='results_row')[:2]
                    for row in candidate_rows:
                        candidate_name = row.find('a').get_text(strip=True)
                        candidate_link = row.find('a')['href']
                        candidate_party = row.find('td', class_='votebox-results-cell--text').get_text(strip=True)

                        candidates.append({
                            'name': candidate_name,
                            'party': candidate_party,
                            'link': f"https://ballotpedia.org{candidate_link}"
                        })

                    
                    break

        if not found_general_election:
            print(f"No general election section found for {state_name} Senate election.")

        return candidates
    else:
        print(f"Failed to access {url}")
        return []


if __name__ == "__main__":
    state = input("Enter your state (e.g., Texas): ")
    voter_info = scrape_voter_info(state)
    senate_candidates = scrape_senate_candidates(state)

    print("\nVoter Info:")
    for info in voter_info:
        print(info)

    print("\nSenate Candidates:")
    for candidate in senate_candidates:
        print(f"{candidate['name']} ({candidate['party']}) - More info: {candidate['link']}")

