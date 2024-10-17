import React, { useContext, useEffect, useState } from 'react';
import { Container, Typography, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import { AddressContext } from '../Context/AddressContext';

const StatePage = () => {
  const { address } = useContext(AddressContext);
  const [stateReps, setStateReps] = useState([]);
  const [electionData, setElectionData] = useState(null);
  const [voterInfo, setVoterInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const civicAPIKey = process.env.REACT_APP_CIVIC_API_KEY;

  useEffect(() => {
    if (address) {
      const fetchStateReps = async () => {
        try {
          setLoading(true);
          console.log('Fetching state representatives for address:', address);

          const response = await axios.get(`https://www.googleapis.com/civicinfo/v2/representatives`, {
            params: { address, key: civicAPIKey }
          });

          console.log('State representatives response:', response.data);

          const offices = response.data.offices;
          const officials = response.data.officials;
          const state = [];

          offices.forEach((office) => {
            if (office.levels && office.levels.includes('administrativeArea1')) {
              office.officialIndices.forEach((index) => {
                const official = officials[index];
                state.push({
                  office: office.name,
                  name: official.name,
                  party: official.party || 'N/A',
                  phone: official.phones ? official.phones[0] : 'N/A',
                  website: official.urls ? official.urls[0] : 'N/A',
                });
              });
            }
          });

          console.log('Extracted state representatives:', state);
          setStateReps(state);
          setErrorMessage('');

          const { stateName, district } = extractStateAndDistrict(response.data);
          console.log('Extracted state and district:', stateName, district);
          fetchElectionData(stateName, district);
        } catch (error) {
          console.error('Error fetching state representatives:', error);
          setErrorMessage('Error fetching state representatives. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchStateReps();
    }
  }, [address, civicAPIKey]);

  const extractStateAndDistrict = (data) => {
    const divisions = data.divisions;
    let stateName = null;
    let district = null;

    Object.keys(divisions).forEach((divisionId) => {
      if (divisionId.includes('state:') && divisionId.includes('cd:')) {
        const stateDivision = divisions[divisionId].name;
        stateName = stateDivision.slice(0, stateDivision.indexOf("'"));
        const districtMatch = stateDivision.match(/\d+\w{2}/);
        district = districtMatch ? districtMatch[0] : null;
        console.log('State Name:', stateName);
        console.log('District:', district);
      }
    });

    return { stateName, district };
  };

  // Fetch election data from the Flask backend at localhost:5000
  const fetchElectionData = async (stateName, district) => {
    try {
      console.log('Fetching election data for:', stateName, 'District:', district);
      const response = await axios.get('http://localhost:5000/api/elections', {
        params: { state: stateName, district: district }
      });

      console.log('Election data response:', response.data);

      const { houseCandidates, senateCandidates, voterInfo } = response.data;

      // Clean up house candidates
      const cleanedHouseCandidates = houseCandidates.map(candidate => ({
        ...candidate,
        party: candidate.party.slice(-2, -1), // Extract the last character only
        link: candidate.link.replace('https://ballotpedia.org', '') // Remove repeated part from link
      }));

      // Clean up senate candidates
      const cleanedSenateCandidates = senateCandidates.map(candidate => ({
        ...candidate,
        party: candidate.party.slice(-2, -1), // Extract the last character only
        link: candidate.link.replace('https://ballotpedia.org', '') // Remove repeated part from link
      }));

      setElectionData({
        house: cleanedHouseCandidates,
        senate: cleanedSenateCandidates,
      });
      setVoterInfo(voterInfo);

      console.log('Cleaned House Candidates:', cleanedHouseCandidates);
      console.log('Cleaned Senate Candidates:', cleanedSenateCandidates);
      console.log('Voter Information:', voterInfo);
    } catch (error) {
      console.error('Error fetching election data:', error);
    }
  };

  // Helper function to map party abbreviations to full names
  const mapPartyToFullName = (partyAbbreviation) => {
    switch (partyAbbreviation) {
      case 'R':
        return 'Republican';
      case 'D':
        return 'Democrat';
      default:
        return partyAbbreviation;
    }
  };

  // Helper function to format the candidate's name and party
  const formatCandidate = (name, party) => {
    const fullPartyName = mapPartyToFullName(party);
    return `${name} (${fullPartyName})`;
  };

  return (
    <Container maxWidth="lg" sx={{ paddingTop: '50px', paddingBottom: '50px' }}>
      {/* Page Header */}
      <Box sx={{ textAlign: 'center', marginBottom: '30px' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          State Elections
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Explore the latest information and resources for state elections.
        </Typography>
      </Box>

      {/* State Representatives Section */}
      <Box sx={{ marginBottom: '50px' }}>
        <Typography variant="h4" gutterBottom>
          Your State Representatives
        </Typography>
        {loading ? (
          <Typography variant="body1" color="textSecondary">
            Loading state representatives...
          </Typography>
        ) : stateReps.length > 0 ? (
          stateReps.map((rep, index) => (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{`${rep.name} (${rep.party}) - ${rep.office}`}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Phone: {rep.phone || 'N/A'} <br />
                  Website: {rep.website ? (
                    <a href={rep.website} target="_blank" rel="noopener noreferrer">
                      {rep.website}
                    </a>
                  ) : 'N/A'}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            {errorMessage || 'No state representatives found for the provided address.'}
          </Typography>
        )}
      </Box>

      {/* Election Information Section */}
      <Box sx={{ marginBottom: '50px' }}>
        <Typography variant="h4" gutterBottom>
          Election Information
        </Typography>
        {electionData ? (
          <Box>
            <Typography variant="h6">House Elections</Typography>
            {electionData.house && electionData.house.length > 0 ? (
              electionData.house.map((candidate, index) => (
                <Typography key={index}>
                  {formatCandidate(candidate.name, candidate.party)} - <a href={candidate.link} target="_blank" rel="noopener noreferrer">More Info</a>
                </Typography>
              ))
            ) : (
              <Typography>No House candidates found</Typography>
            )}

            <Typography variant="h6">Senate Elections</Typography>
            {electionData.senate && electionData.senate.length > 0 ? (
              electionData.senate.map((candidate, index) => (
                <Typography key={index}>
                  {formatCandidate(candidate.name, candidate.party)} - <a href={candidate.link} target="_blank" rel="noopener noreferrer">More Info</a>
                </Typography>
              ))
            ) : (
              <Typography>No Senate candidates found</Typography>
            )}

            {/* Voter Information Section */}
            <Typography variant="h6" gutterBottom>
              Voter Information
            </Typography>
            {voterInfo && voterInfo.length > 0 ? (
              voterInfo.map((info, index) => (
                <Typography key={index}>
                  {Object.keys(info)[0]}: {Object.values(info)[0]}
                </Typography>
              ))
            ) : (
              <Typography>No voter information available.</Typography>
            )}
          </Box>
        ) : (
          <Typography variant="body1" color="textSecondary">
            No election information found for the provided address.
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default StatePage;