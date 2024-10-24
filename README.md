# CivicCompass Election Information App

CivicCompass is a voting application designed to provide easy access to critical election information at the local, state, and national levels across the United States. The app primarily aims to assist new voters who might feel overwhelmed by the abundance of election-related details spread across multiple sites. It simplifies the process by presenting relevant information in one place. However, it is also a valuable resource for youth, non-voters, and anyone interested in staying up-to-date with political developments.

## Key Features

### Localized Election Information
CivicCompass aggregates election details from various sources, offering information tailored to users' specific locations. This includes information on upcoming elections, candidate profiles, and voting dates.

### Email Notifications
Using an Express API, CivicCompass integrates the **Nodemailer** library to schedule and send email reminders to users. These notifications provide countdowns to election days and highlight critical reminders to help users stay informed.

### Ballotpedia Integration
The app scrapes information from **Ballotpedia** to offer comprehensive details about the 2024 elections:
1. **URL Building:** CivicCompass dynamically builds Ballotpedia URLs based on location parameters such as state and district.
2. **Web Scraping:** The app uses Python’s **BeautifulSoup** to extract essential election-related content from the HTML of the Ballotpedia page.
3. **Geolocation Data:** By sending user coordinates to **Google's Geocoding API**, the app retrieves precise address information that is then fed into the web scraper to refine election details based on the user's location.

### Visualizations with Recharts
The app uses the **Recharts** library to create interactive charts and graphs that present demographic data, making complex election data easier to understand and more engaging.

### CivicAPI Integration
CivicCompass connects to the **Google Civic Information API** to offer users location-specific information about representatives and voting, providing a comprehensive view of their civic landscape.

### Biography Display
CivicCompass fetches representative biographies from Wikipedia when users click on a card

### User Interface
The app utilizes **Material UI** for a modern and responsive design:
- **Cards** are used to organize election information neatly.
- Various components ensure a seamless user experience across devices.
