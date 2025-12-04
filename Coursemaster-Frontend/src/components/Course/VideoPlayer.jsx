const VideoPlayer = ({ url }) => {
  if (!url) return <p>No video url provided</p>;

  // Extract ID if user passes full URL
  const extractVideoId = (link) => {
    try {
      if (link.includes("youtu.be")) {
        return link.split("youtu.be/")[1];
      }
      if (link.includes("watch?v=")) {
        return link.split("watch?v=")[1];
      }
      // Assume plain ID
      return link;
    } catch {
      return link;
    }
  };

  const videoId = extractVideoId(url);

  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
      <iframe
        src={embedUrl}
        title="YouTube video player"
        allowFullScreen
        className="absolute inset-0 w-full h-full rounded-lg border border-gray-300"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      ></iframe>
    </div>
  );
};

export default VideoPlayer;
