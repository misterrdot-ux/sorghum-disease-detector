let model, maxPredictions;

async function loadModel() {
  document.getElementById("loader").style.display = "block";
  const modelURL = "model/model.json";
  const metadataURL = "model/metadata.json";
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();
  document.getElementById("loader").style.display = "none";
}

loadModel();

const imageUpload = document.getElementById("imageUpload");
const preview = document.getElementById("preview");
const result = document.getElementById("result");
const diseaseInfo = document.getElementById("diseaseInfo");
const loader = document.getElementById("loader");

// Preview uploaded image
imageUpload.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.innerHTML = `<img src="${e.target.result}" id="uploadedImage">`;
    };
    reader.readAsDataURL(file);
  }
});

// Predict
document.getElementById("predictButton").addEventListener("click", async () => {
  const image = document.getElementById("uploadedImage");
  if (!image) {
    result.innerText = "Please upload an image first.";
    return;
  }

  loader.style.display = "block";
  const prediction = await model.predict(image, false);
  prediction.sort((a, b) => b.probability - a.probability);

  const top = prediction[0];
  loader.style.display = "none";

  result.innerText = `Prediction: ${top.className} (${(top.probability * 100).toFixed(2)}%)`;

  // Match your metadata labels
  const diseaseDescriptions = {
    "Rust": "🧡 Rust causes orange-brown pustules on leaves. Reduce humidity and apply appropriate fungicides.",
    "loose smut": "⚠️ Loose smut replaces grains with black powdery spores. Use certified seeds and treat with fungicide.",
    "Head Smut": "⚠️ Head smut causes blackened heads. Use resistant varieties and crop rotation.",
    "Covered Kernel smut": "⚠️ Covered kernel smut keeps black spores inside grain hulls. Avoid reusing infected seeds.",
    "Cereal Grain molds": "⚠️ Mold growth occurs on stored or moist grains. Dry crops properly and improve storage ventilation.",
    "Anthracnose and Red Rot": "🚨 Causes reddish lesions and stem rot. Use resistant varieties and avoid waterlogging."
  };

  diseaseInfo.innerText = diseaseDescriptions[top.className] || "No description available for this class.";
});
