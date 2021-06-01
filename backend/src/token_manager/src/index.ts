import app from './server';

const PORT = process.env.PORT || 8080;

// Start the servers
app.listen(PORT, () => {
  console.log(`Token manager service started on port ${PORT}`);
});
