import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [image, setImage] = useState(null); // Selected image
  const [imageName, setImageName] = useState(""); // Image name
  const [preview, setPreview] = useState(""); // Preview URL
  const [resultImage, setResultImage] = useState(""); // Result image URL
  const [loading, setLoading] = useState(false); // Loading state
  const [resultImages, setResultImages] =useState([]);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file)); // Generate preview URL
  };

  // Handle image name input
  const handleImageNameChange = (e) => {
    setImageName(e.target.value);
  };

  // Upload the image and name to the server
  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image first!");
      return;
    }

    if (!imageName.trim()) {
      alert("Please enter a name for the image!");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("filename", imageName);

    try {
      setLoading(true);
      const response = await axios.post(
        "https://fyp-j7sa.onrender.com/yolo/upload/",
        formData
      );
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };

  const fetchResult = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://fyp-j7sa.onrender.com/yolo/getImages/"
      );

      if (
        response.data &&
        response.data.images &&
        response.data.images.length > 0
      ) {
        const images = response.data.images.map((image) => ({
          fileName: image.file_name,
          imageData: `data:image/png;base64,${image.image_data}`, // Assuming base64
        }));

        setResultImages(images); // Update state with the list of images
        alert(`Fetched ${images.length} images.`);
      } else {
        alert("No images found.");
      }
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
        <input
          type="text"
          placeholder="Enter image name"
          value={imageName}
          onChange={handleImageNameChange}
          style={{ margin: "10px 0", display: "block" }}
        />
        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload Image"}
        </button>
      </div>

      <hr style={{ margin: "20px 0" }} />

      {/* Fetch Result Section */}
      {
        /* <div>
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
      </div> */
        <div>
          <button onClick={fetchResult} disabled={loading}>
            {loading ? "Loading..." : "Fetch Images"}
          </button>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              marginTop: "20px",
            }}
          >
            {resultImages.map((image, index) => (
              <div key={index} style={{ textAlign: "center" }}>
                <img
                  src={image.imageData}
                  alt={image.fileName}
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    border: "1px solid #ddd",
                  }}
                />
                <p>{image.fileName}</p>
              </div>
            ))}
          </div>
        </div>
      }
    </div>
  );
};

export default App;
