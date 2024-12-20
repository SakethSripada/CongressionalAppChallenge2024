from flask import Flask, jsonify, request
from flask_cors import CORS  
from house_scraper import scrape_house_candidates
from senate_scraper import scrape_senate_candidates, scrape_voter_info
from municipal_scraper import scrape_municipal_candidates  
from wiki import get_wikipedia_bio

app = Flask(__name__)
CORS(app)  

@app.route('/api/elections', methods=['GET'])
def get_election_data():
    state = request.args.get('state')
    district = request.args.get('district')

    if not state or not district:
        return jsonify({'error': 'State and district are required'}), 400

    try:
        print(f"Fetching election data for State: {state}, District: {district}")  
        house_candidates = scrape_house_candidates(state, district)
        senate_candidates = scrape_senate_candidates(state)
        voter_info = scrape_voter_info(state)

        print("Election data fetched successfully.")  
        return jsonify({
            'houseCandidates': house_candidates,
            'senateCandidates': senate_candidates,
            'voterInfo': voter_info
        })

    except Exception as e:
        print(f"Error fetching election data: {str(e)}")  
        return jsonify({'error': str(e)}), 500

@app.route('/api/municipal_candidates', methods=['GET'])
def get_municipal_candidates():
    county = request.args.get('county')
    state = request.args.get('state')

    if not county or not state:
        return jsonify({'error': 'County and state are required'}), 400

    try:
        print(f"Fetching municipal candidates for County: {county}, State: {state}")  
        results = scrape_municipal_candidates(county, state)
        print("Municipal candidates fetched successfully.")  
        return jsonify(results)  
    except Exception as e:
        print(f"Error fetching municipal candidates: {str(e)}")  
        return jsonify({'error': str(e)}), 500
    

@app.route('/api/candidate_bio', methods=['GET'])
def get_candidate_bio():
    name = request.args.get('name')
    role = request.args.get('role')
    if not name or not role:
        return jsonify({'error': 'Candidate name and role are required'}), 400

    try:
        bio_data = get_wikipedia_bio(name, role)
        return jsonify(bio_data)
    except Exception as e:
        print(f"Error fetching candidate bio: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
