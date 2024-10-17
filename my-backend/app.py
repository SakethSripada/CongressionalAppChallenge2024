from flask import Flask, jsonify, request
from flask_cors import CORS  # Import CORS
from house_scraper import scrape_house_candidates
from senate_scraper import scrape_senate_candidates, scrape_voter_info

app = Flask(__name__)
CORS(app)  # Enable CORS for the entire app

@app.route('/api/elections', methods=['GET'])
def get_election_data():
    state = request.args.get('state')
    district = request.args.get('district')

    if not state or not district:
        return jsonify({'error': 'State and district are required'}), 400

    try:
        house_candidates = scrape_house_candidates(state, district)
        senate_candidates = scrape_senate_candidates(state)
        voter_info = scrape_voter_info(state)

        return jsonify({
            'houseCandidates': house_candidates,
            'senateCandidates': senate_candidates,
            'voterInfo': voter_info
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)