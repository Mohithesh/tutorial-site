import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VideoList from '../components/VideoList';
import VideoUploadForm from '../components/VideoUploadForm';

export default function UserDashboard() {
  const [videos, setVideos] = useState([]);

  const fetchVideos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/videos', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      });
      setVideos(res.data);
    } catch (err) {
      console.error('Error fetching videos:', err);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div>
      <h2>Faculty Dashboard</h2>
      <VideoUploadForm refresh={fetchVideos} />
      <VideoList videos={videos} refresh={fetchVideos} />
    </div>
  );
}