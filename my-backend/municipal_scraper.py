import requests
from bs4 import BeautifulSoup

def get_full_party_name(party_abbreviation):
    """Map party abbreviation to full party name."""
    party_map = {
        'R': 'Republican',
        'D': 'Democrat',
        'I': 'Independent',
        'W': 'Write-in',
        'N': 'No Party Affiliation'
    }
    return party_map.get(party_abbreviation, party_abbreviation)

def scrape_municipal_candidates(county, state):
    
    url = f"https://ballotpedia.org/Municipal_elections_in_{county.replace(' ', '_')},_{state.replace(' ', '_')}_(2024)"
    print(f"Accessing URL: {url}")  # Debug statement

    response = requests.get(url)
    if response.status_code != 200:
        print(f"Failed to access {url} with status code {response.status_code}")
        return {'candidates': [], 'demographics': []}

    soup = BeautifulSoup(response.text, 'html.parser')

    
    candidates = []
    election_headers = soup.find_all('h5', class_='votebox-header-election-type')

    for header in election_headers:
        if 'general election' in header.text.lower():
            election_name = header.text.strip()  
            
            candidates_table = header.find_next('table')
            if candidates_table:
                candidate_rows = candidates_table.find_all('tr', class_='results_row')
                for row in candidate_rows:
                    name_link = row.find('td', class_='votebox-results-cell--text').find('a')
                    if name_link:
                        name = name_link.text.strip()
                        
                        party_text = row.find('td', class_='votebox-results-cell--text').text.strip()
                        party_symbol = party_text.split()[-1]  
                        party_symbol = party_symbol.replace("(", "").replace(")", "").strip()  
                        full_party_name = get_full_party_name(party_symbol)  
                        
                        candidates.append({
                            'name': name,
                            'party': full_party_name,  
                            'link': name_link['href'],  
                            'election': election_name  
                        })

    print("Candidates:")
    for candidate in candidates:
        print(f"Name: {candidate['name']}, Party: {candidate['party']}, Link: {candidate['link']}, Election: {candidate['election']}")  # Debug statement

    # Scrape demographics
    demographics = []
    demographics_table = soup.find('table', class_='census-table-widget')
    if demographics_table:
        rows = demographics_table.find_all('tr')
        for row in rows:
            header = row.find('th', class_='census-table-census-item-header')
            if header:
                label = header.text.strip()
                cells = row.find_all('td', class_='census-table-census-item')
                if len(cells) == 2:
                    value_collin = cells[0].text.strip()
                    value_texas = cells[1].text.strip()
                    demographics.append({'label': label, 'value': f"{value_collin} (Collin County), {value_texas} (Texas)"})

    
    print("\nDemographic Information:")
    if demographics:
        print(f"{'Demographic':<40} {'Value'}")
        print('-' * 60)
        for item in demographics:
            print(f"{item['label']:<40} {item['value']}")
    else:
        print("No demographic data found.")

    return {'candidates': candidates, 'demographics': demographics}


if __name__ == "__main__":
    county = "Collin County"
    state = "Texas"
    results = scrape_municipal_candidates(county, state)
    print("Final Results:")
    print("Candidates:", results['candidates'])
    print("Demographics:", results['demographics'])