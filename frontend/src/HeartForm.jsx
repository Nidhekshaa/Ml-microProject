import { useState } from "react";
import "./heartForm.css";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function HeartForm() {
  const [formData, setFormData] = useState({
    age: "",sex: "",cp: "",trestbps: "",chol: "",fbs: "",restecg: "",thalach: "",exang: "",oldpeak: "",slope: "",ca: "",thal: "",
  });

  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [fieldStatus, setFieldStatus] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = [
      "age",
      "trestbps",
      "chol",
      "thalach",
      "oldpeak",
    ].includes(name)
      ? parseFloat(value)
      : parseInt(value);
    setFormData({ ...formData, [name]: parsedValue });
  };

  const getFieldStatus = (data) => {
    const status = {};

    status.age = data.age < 30 || data.age > 60 ? "Critical" : "Normal";
    status.trestbps = data.trestbps < 90 || data.trestbps > 140 ? "Critical" : "Normal";
    status.chol = data.chol > 240 ? "Critical" : "Normal";
    status.fbs = data.fbs === 1 ? "Critical" : "Normal";
    status.thalach = data.thalach < 100 ? "Critical" : "Normal";
    status.oldpeak = data.oldpeak > 2 ? "Critical" : "Normal";
    status.ca = data.ca > 0 ? "Critical" : "Normal";
    status.sex = "Normal";
    status.cp = data.cp > 1 ? "Critical" : "Normal";
    status.restecg = data.restecg > 0 ? "Critical" : "Normal";
    status.exang = data.exang === 1 ? "Critical" : "Normal";
    status.slope = data.slope === 2 ? "Critical" : "Normal";
    status.thal = data.thal > 1 ? "Critical" : "Normal";

    return status;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    console.log("Prediction Response:", data);

    const probability = parseFloat(data.probability); // Ensure it's a floating point number between 0 and 1
    const prediction =
      data.prediction == 1 ? "Heart Disease Detected" : "No Heart Disease";

    setResult(
      `${prediction} with a probability of ${Math.round(probability * 100)}%`
    );

    setChartData({
      labels: ["Heart Disease", "No Heart Disease"],
      datasets: [
        {
          label: "Prediction Confidence",
          data: [probability * 100, (1 - probability) * 100],
          backgroundColor: ["#ff4d4d", "#4dff4d"],
          borderWidth: 1,
        },
      ],
    });

    const status = getFieldStatus(formData);
    setFieldStatus(status);
  } catch (error) {
    console.error("Prediction failed:", error);
    setResult("Error: Could not connect to backend.");
  }
};

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>age:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>sex:</label>
          <select
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="1">Male</option>
            <option value="0">Female</option>
          </select>
        </div>

        {["trestbps", "chol", "fbs", "thalach", "oldpeak"].map((key) => (
          <div key={key}>
            <label>{key}:</label>
            <input
              type="number"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        <div>
          <label>cp (Chest Pain Type):</label>
          <select
            name="cp"
            value={formData.cp}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="0">No chest pain</option>
            <option value="1">Typical Angina</option>
            <option value="2">Atypical Angina</option>
            <option value="3">Non-anginal Pain</option>
          </select>
        </div>

        <div>
          <label>restecg (Resting ECG Results):</label>
          <select
            name="restecg"
            value={formData.restecg}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="0">Normal</option>
            <option value="1">ST-T Wave Abnormality</option>
            <option value="2">Left Ventricular Hypertrophy</option>
          </select>
        </div>

        <div>
          <label>exang (Exercise-induced Angina):</label>
          <select
            name="exang"
            value={formData.exang}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="1">Exercise induced angina</option>
            <option value="0">No exercise induced angina</option>
          </select>
        </div>

        <div>
          <label>slope (Slope of Peak Exercise ST Segment):</label>
          <select
            name="slope"
            value={formData.slope}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="0">Upsloping</option>
            <option value="1">Flat</option>
            <option value="2">Downsloping</option>
          </select>
        </div>

        <div>
          <label>ca (Number of Major Vessels Colored by Fluoroscopy):</label>
          <select
            name="ca"
            value={formData.ca}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            {[0, 1, 2, 3].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>thal:</label>
          <select
            name="thal"
            value={formData.thal}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="1">Normal</option>
            <option value="2">Fixed Defect</option>
            <option value="3">Reversible Defect</option>
          </select>
        </div>

        <button type="submit">Predict</button>
      </form>

      {result && (
        <p>
          <strong>Result:</strong> {result}
        </p>
      )}

      {chartData && (
        <div style={{ width: "300px", margin: "20px auto" }}>
          <Pie data={chartData} />
        </div>
      )}

      {fieldStatus && Object.keys(fieldStatus).length > 0 && (
        <div style={{ maxWidth: "500px", margin: "20px auto" }}>
          <h3>Field Evaluation</h3>
          <ul>
            {Object.entries(fieldStatus).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong>{" "}
                {value === "Critical" ? (
                  <span style={{ color: "red" }}>{value}</span>
                ) : (
                  <span style={{ color: "green" }}>{value}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
