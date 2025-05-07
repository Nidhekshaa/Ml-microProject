// HeartForm.jsx
import { useState } from 'react';

export default function HeartForm() {
  const [formData, setFormData] = useState({
    age: '', sex: '', cp: '', trestbps: '', chol: '',
    fbs: '', restecg: '', thalach: '', exang: '',
    oldpeak: '', slope: '', ca: '', thal: ''
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    setResult(data.prediction ? 'Heart Disease Detected' : 'No Heart Disease');
  };

  return (
    <form onSubmit={handleSubmit}>
      {Object.keys(formData).map((key) => (
        <div key={key}>
          <label>{key}: </label>
          <input type="number" name={key} value={formData[key]} onChange={handleChange} required />
        </div>
      ))}
      <button type="submit">Predict</button>
      {result && <p><strong>Result:</strong> {result}</p>}
    </form>
  );
}
