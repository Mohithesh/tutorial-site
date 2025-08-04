import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import axios from 'axios';

export default function VideoUploadForm({ refresh }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [topic, setTopic] = useState('');
  const [file, setFile] = useState(null);

  const handle = async () => {
    if (!file) return alert('Please select a video file');

    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);
    formData.append('description', desc);
    formData.append('topic', topic);

    await axios.post('http://localhost:5000/api/videos/upload', formData, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'multipart/form-data'
      }
    });

    refresh();
    setTitle('');
    setDesc('');
    setTopic('');
    setFile(null);
  };

  return (
    <Box p={2} mb={2}>
      <TextField label="Title" fullWidth value={title} onChange={e => setTitle(e.target.value)} />
      <TextField label="Description" fullWidth value={desc} onChange={e => setDesc(e.target.value)} sx={{ mt: 2 }} />
      <TextField label="Topic" fullWidth value={topic} onChange={e => setTopic(e.target.value)} sx={{ mt: 2 }} />
      <input type="file" accept="video/*" onChange={e => setFile(e.target.files[0])} style={{ marginTop: '16px' }} />
      <Button variant="contained" sx={{ mt: 2 }} onClick={handle}>Upload</Button>
    </Box>
  );
}
