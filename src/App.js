import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [image, setImage] = useState(null); // Selected image
  const [preview, setPreview] = useState(""); // Preview URL
  const [resultImage, setResultImage] = useState(""); // Result image URL
  const [loading, setLoading] = useState(false); // Loading state

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file)); // Generate preview URL
  };

  // Upload the image to the server
  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/upload", formData);
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch the result of the image processing
  const fetchResult = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/result");
      setResultImage(response.data.resultUrl); // Assuming the backend sends the result image URL
      alert("Result fetched successfully!");
    } catch (error) {
      console.error("Error fetching result:", error);
      alert("Failed to fetch result.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Image Upload and Process</h1>

      {/* Image Upload Section */}
      <div>
        <h2>Upload Image</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ marginBottom: "10px" }}
        />
        {preview && (
          <div>
            <h3>Preview:</h3>
            <img src={preview} alt="Preview" style={{ width: "200px" }} />
          </div>
        )}
        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload Image"}
        </button>
      </div>

      <hr style={{ margin: "20px 0" }} />

      {/* Fetch Result Section */}
      <div>
        <h2>Fetch Result</h2>
        <button onClick={fetchResult} disabled={loading}>
          {loading ? "Fetching..." : "Get Result"}
        </button>
        {resultImage && (
          <div>
            <h3>Result Image:</h3>
            <img src={resultImage} alt="Result" style={{ width: "200px" }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
