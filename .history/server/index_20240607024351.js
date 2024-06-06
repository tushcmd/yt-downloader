import express from 'express';
import ytdl from 'ytdl-core';
import cors from 'cors';

const app = express();

app.use(
  cors({
    origin: 'https://',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  })
);

app.get('/download', async (req, res) => {
  const videoUrl = req.query.url;

  try {
    const info = await ytdl.getInfo(videoUrl);
    const format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });
    const videoStream = ytdl(videoUrl, { format });

    res.header(
      'Content-Disposition',
      `attachment; filename="${info.videoDetails.title}.${format.container}"`
    );
    videoStream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error downloading video');
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
