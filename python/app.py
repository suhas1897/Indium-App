from flask import Flask, request, jsonify
from flask_cors import CORS
from colorthief import ColorThief
import os
import csv

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def load_dataset():
    dataset = []
    with open('./dataset.csv', mode='r') as file:
        csv_reader = csv.DictReader(file)
        for row in csv_reader:
            rgb_values = tuple(map(int, row['RGB Values'][1:-1].split(', ')))
            dataset.append({
                'Sample ID': row['Sample ID'],
                'RGB Values': rgb_values,
                'Disease': row['Disease'],
                'Doctor Name': row['Doctor Name'],
                'Hospital Name': row['Hospital Name'],
                'Address': row['Address'],
                'City': row['City'],
                'Contact Number': row['Contact Number']
            })
    return dataset

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'photo' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['photo']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filepath)

        try:
            ct = ColorThief(filepath)
            dominant_color = ct.get_color(quality=1)
            dominant_color_str = f'rgb({dominant_color[0]},{dominant_color[1]},{dominant_color[2]})'

            dataset = load_dataset()
            matches = [
                entry for entry in dataset
                if entry['RGB Values'] == dominant_color
            ]

            if matches:
                result = [{ 'Disease': match['Disease'],
                           'Hospital Name': match['Hospital Name'],
                           'Address': match['Address'],
                           'Contact Number': match['Contact Number']
                           
                           }
                          for match in matches]
                return jsonify({'color': dominant_color_str, 'matches': result})
            else:
                # Return an empty array instead of a string when no matches are found
                return jsonify({'color': dominant_color_str, 'matches': []})

        finally:
            os.remove(filepath)

    return jsonify({'error': 'File upload failed'}), 500


if __name__ == '__main__':
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.run(debug=True, host='0.0.0.0', port=5000)
