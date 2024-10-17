from municipal_scraper import scrape_municipal_candidates

# Replace with your test values
county = "Collin County"
state = "Texas"

# Call the municipal candidates scraper
result = scrape_municipal_candidates(county, state)

# Print the results
print("Municipal Candidates:")
for candidate in result['candidates']:
    print(f"Name: {candidate['name']}, Party: {candidate['party']}, Link: {candidate['link']}")

print("\nDemographic Information:")
for demographic in result['demographics']:
    print(f"{demographic['label']}: {demographic['value']}")