const accessKey = "uWnFMg-4XUzzaMNfraU791e3d_gRZ-CI9wDYHkVTaSQ";

fetch(
  `https://api.unsplash.com/photos/random?query=nighttime+city&client_id=${accessKey}`
)
  .then((response) => response.json())
  .then((data) => {
    document.body.style.backgroundImage = `url(${data.urls.full})`;
  })
  .catch((error) => {
    console.error("Error fetching the image:", error);
  });
