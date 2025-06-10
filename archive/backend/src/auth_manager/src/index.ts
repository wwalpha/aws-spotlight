import app from './server';

const PORT = process.env.PORT || 8080;

// Start the servers
app.listen(PORT, () => {
  console.log(`Auth manager service started on port ${PORT}`);
});
