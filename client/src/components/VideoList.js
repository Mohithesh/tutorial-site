
import React from 'react';
import { Box, Typography } from '@mui/material';

export default function VideoList({ videos }) {
  const grouped = videos.reduce((acc, v) => {
    acc[v.topic] = acc[v.topic] || [];
    acc[v.topic].push(v);
    return acc;
  }, {});
  return (
    <Box p={2}>
      {Object.entries(grouped).map(([topic, vids]) => (
        <Box key={topic} mb={4}>
          <Typography variant="h5">{topic}</Typography>
          {vids.map(v => (
            <Box key={v.id} mt={1} p={1} border="1px solid #ccc">
              <Typography><strong>{v.title}</strong> by {v.uploaded_by_name}</Typography>
              <Typography>{v.description}</Typography>
              <video width="320" height="240" controls src={v.video_url} />
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}
