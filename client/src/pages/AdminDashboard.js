import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VideoUploadForm from '../components/VideoUploadForm';
import VideoList from '../components/VideoList';

export default function AdminDashboard() {
  const [videos, setVideos] = useState([]);
  const fetchVideos = async () => {
    const res = await axios.get('http://localhost:5000/api/videos', {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
    });
    setVideos(res.data);
  };
  useEffect(() => { fetchVideos(); }, []);
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <VideoUploadForm refresh={fetchVideos} />
      <VideoList videos={videos} />
    </div>
  );
}
