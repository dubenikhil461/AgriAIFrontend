import { useState } from "react";

function DiseaseDetector() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");

  const handleUpload = () => {
    if (!file) return alert("Please select an image");

    // Dummy detection logic
    const diseases = ["Healthy", "Blight", "Rust", "Mosaic Virus"];
    const randomResult = diseases[Math.floor(Math.random() * diseases.length)];

    setResult(randomResult);
  };

  return (
    <div className="disease-detector">
      <h2>Crop Disease Detector</h2>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleUpload}>Detect Disease</button>
      {result && <p>Result: {result}</p>}
    </div>
  );
}

export default DiseaseDetector;
