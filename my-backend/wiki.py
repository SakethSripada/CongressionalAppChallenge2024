import requests
from bs4 import BeautifulSoup
import re

def get_wikipedia_bio(name, role):
    search_name = "_".join(name.split())
    url = f"https://en.wikipedia.org/wiki/{search_name}"

    response = requests.get(url)
    
    if response.status_code != 200:
        return {"bio": "No biography found.", "image_url": None}
    
    soup = BeautifulSoup(response.content, 'html.parser')

    infobox = soup.find('table', class_='infobox')
    image_url = None
    if infobox:
        image = infobox.find('img')
        if image:
            image_url = "https:" + image['src']

    bio_paragraphs = soup.find_all('p')

    if not bio_paragraphs:
        return {"bio": "No biography found.", "image_url": image_url}

    bio = ""
    for paragraph in bio_paragraphs:
        if paragraph.text.strip():
            cleaned_text = re.sub(r'\[\d+\]', '', paragraph.text)
            cleaned_text = cleaned_text.replace('"', '').replace("'", '')
            cleaned_text = re.sub(r'(\w+)ss\b', r"\1s's", cleaned_text)
            bio += cleaned_text.strip() + "\n"
            

            
            if len(bio) > 500:
                break

    if len(bio.strip()) < 100:
        return {"bio": "No relevant biography found.", "image_url": None}

    return {"bio": bio.strip(), "image_url": image_url}
