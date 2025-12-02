import express from 'express';
const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

app.get('/api', (req, res) => {
  res.send('Welcome to the API');
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
