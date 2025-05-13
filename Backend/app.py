from flask import Flask, request, jsonify
import pickle
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the model
with open('heart_model.pkl', 'rb') as f:
    model = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json

    # Ensure all fields are present
    try:
        features = np.array([[ 
            data['age'], data['sex'], data['cp'], data['trestbps'], data['chol'],
            data['fbs'], data['restecg'], data['thalach'], data['exang'],
            data['oldpeak'], data['slope'], data['ca'], data['thal']
        ]])
    except KeyError as e:
        return jsonify({'error': f'Missing field: {str(e)}'}), 400

    # Prediction and probability
    probability = model.predict_proba(features)[0][1]  # Prob of class 1 (Heart Disease)
    prediction = int(probability >= 0.5)

    return jsonify({'prediction': prediction, 'probability': float(probability)})

if __name__ == '__main__':
    app.run(debug=True)
