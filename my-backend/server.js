const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio'); // For HTML scraping
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable CORS for all routes

// Function to construct Ballotpedia URL for House elections
function constructBallotpediaHouseURL(state, district) {
  const stateFormatted = state.replace(" ", "_");
  if (state.endsWith("s")) {
    return `https://ballotpedia.org/${stateFormatted}%27_${district}_Congressional_District_election,_2024`;
  } else {
    return `https://ballotpedia.org/${stateFormatted}%27s_${district}_Congressional_District_election,_2024`;
  }
}

// Function to scrape House candidates
async function scrapeHouseCandidates(ballotpediaURL) {
  try {
    const response = await axios.get(ballotpediaURL);
    const html = response.data;
    const $ = cheerio.load(html);

    const candidates = [];
    const generalElectionSection = $('h5').filter((i, el) => $(el).text().toLowerCase().includes('general election'));
    const resultsTable = generalElectionSection.next('table');

    if (resultsTable.length) {
      const candidateRows = resultsTable.find('tr.results_row').slice(0, 2); // First 2 candidates
      candidateRows.each((index, row) => {
        const candidateName = $(row).find('a').first().text().trim();
        const candidateLink = $(row).find('a').first().attr('href');
        const candidateParty = $(row).find('td.votebox-results-cell--text').text().trim();

        candidates.push({
          name: candidateName,
          party: candidateParty,
          link: `https://ballotpedia.org${candidateLink}`,
        });
      });
    }
    return candidates;
  } catch (error) {
    console.error(`Error fetching House candidates: ${error}`);
    return [];
  }
}

// Function to construct Ballotpedia URL for Senate elections
function constructSenateBallotpediaURL(state) {
  const stateFormatted = state.replace(" ", "_");
  return `https://ballotpedia.org/United_States_Senate_election_in_${stateFormatted},_2024`;
}

// Function to scrape Senate candidates
async function scrapeSenateCandidates(state) {
  const url = constructSenateBallotpediaURL(state);
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const candidates = [];
    const generalElectionSection = $('h5.votebox-header-election-type').filter((i, el) => $(el).text().toLowerCase().includes('general election'));
    const resultsTable = generalElectionSection.next('table');

    if (resultsTable.length) {
      const candidateRows = resultsTable.find('tr.results_row').slice(0, 2); // First 2 candidates
      candidateRows.each((index, row) => {
        const candidateName = $(row).find('a').first().text().trim();
        const candidateLink = $(row).find('a').first().attr('href');
        const candidateParty = $(row).find('td.votebox-results-cell--text').text().trim();

        candidates.push({
          name: candidateName,
          party: candidateParty,
          link: `https://ballotpedia.org${candidateLink}`,
        });
      });
    }
    return candidates;
  } catch (error) {
    console.error(`Error fetching Senate candidates: ${error}`);
    return [];
  }
}

// Route to fetch House and Senate candidates
app.get('/api/elections', async (req, res) => {
  const { state, district } = req.query;

  // Validate input
  if (!state || !district) {
    return res.status(400).json({ error: 'State and district parameters are required.' });
  }

  // Scrape House and Senate candidates
  const houseURL = constructBallotpediaHouseURL(state, district);
  const houseCandidates = await scrapeHouseCandidates(houseURL);

  const senateCandidates = await scrapeSenateCandidates(state);

  // Send the scraped data back to the frontend
  res.json({
    houseCandidates,
    senateCandidates,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend is running on port ${PORT}`);
});