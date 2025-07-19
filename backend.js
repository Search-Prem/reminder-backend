const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();

// Add Reminder
app.post('/add', async (req, res) => {
  const { text, date, time } = req.body;
  try {
    await prisma.reminder.create({
      data: {
        text,
        date: new Date(date),
        time,
      }
    });
    res.status(200).send('Added');
  } catch (error) {
    console.error('Insert error:', error);
    res.status(500).send('Server insert error');
  }
});

// Show all Reminders
app.get('/show', async (req, res) => {
  try {
    const reminders = await prisma.reminder.findMany({
      orderBy: { id: 'asc' }
    });
    res.json(reminders);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).send('Server error');
  }
});

// Update Reminder
app.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { text, date, time } = req.body;
  try {
    await prisma.reminder.update({
      where: { id: parseInt(id) },
      data: { text, date: new Date(date), time }
    });
    res.status(200).send('Reminder updated');
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).send('Update failed');
  }
});

// Delete Reminder
app.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.reminder.delete({
      where: { id: parseInt(id) }
    });
    res.status(200).send('Reminder deleted');
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).send('Delete failed');
  }
});

// Toggle Status (Done <-> Pending)
app.put('/toggle-status/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const current = await prisma.reminder.findUnique({
      where: { id: parseInt(id) }
    });
    const newStatus = current.status === 'Done' ? 'Pending' : 'Done';

    await prisma.reminder.update({
      where: { id: parseInt(id) },
      data: { status: newStatus }
    });

    res.status(200).send('Status updated');
  } catch (error) {
    console.error('Status toggle error:', error);
    res.status(500).send('Failed to toggle status');
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
