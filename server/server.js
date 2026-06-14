const connectDB = require('./config/db');
const { seedAchievements } = require('./utils/seedAchievements');
const app = require('./app');

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  if (process.env.NODE_ENV !== 'production') {
    await seedAchievements();
  }
});
