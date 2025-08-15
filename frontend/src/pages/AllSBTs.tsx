import React, { useEffect, useState } from "react";
import axios from "axios";

interface SBT {
  tokenId: string;
  name: string;
  description: string;
  videoUrl: string; // full URL from backend
}

const AllSBTs: React.FC = () => {
  const [sbts, setSbts] = useState<SBT[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSBTs = async () => {
    try {
      const res = await axios.get("http://localhost:4000/sbts"); // backend endpoint
      setSbts(res.data);
    } catch (error) {
      console.error("Error fetching SBTs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSBTs();

    // Optional: Refresh automatically every 5 seconds for live updates
    const interval = setInterval(fetchSBTs, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 text-lg font-semibold">
        Loading SBTs...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">All Soulbound Tokens</h1>
      {sbts.length === 0 ? (
        <p className="text-center text-gray-500">No SBTs minted yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sbts.map((sbt) => (
            <div
              key={sbt.tokenId}
              className="bg-white rounded-lg shadow-md p-4 border"
            >
              <h2 className="text-xl font-semibold mb-2">{sbt.name}</h2>
              <p className="text-gray-700 mb-4">{sbt.description}</p>
              
              <video
                controls
                className="w-full rounded-lg mb-4"
                src={`http://localhost:4000${sbt.videoUrl}`}
              >
                Your browser does not support the video tag.
              </video>
              
              <p className="text-sm text-gray-500">Token ID: {sbt.tokenId}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllSBTs;
