require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define schemas and models
const customerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  checkinDate: { type: Date, required: true },
  checkoutDate: { type: Date, required: true },
  roomNumber: { type: String, required: true },
  roomType: { type: String, required: true },
  checkinTime: { type: String, required: true },
  checkoutTime: { type: String, required: true },
  mode: { type: String, required: true },
  idType: { type: String, required: true },
  idValidationStatus: { type: String, required: true },
  checkinStatus: { type: String, required: true },
  roomAlloted: { type: String, required: true },
  omsCheckin: { type: Date, required: true },
  omsCheckout: { type: Date, required: true },
  idNumber: { type: String, required: true },
  totalGuests: { type: Number, required: true },
});

const Customer = mongoose.model('Customer', customerSchema);

const staffSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  contact: { type: String, required: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  staffAccess: { type: String, required: true },
  staffProgress: { type: String, required: true },
  idType: { type: String, required: true },
  idNumber: { type: String, required: true },
});

const Staff = mongoose.model('Staff', staffSchema);

// Basic health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// API endpoints
// Create new customer profile
app.post('/api/customers', async (req, res) => {
  try {
    const newCustomer = new Customer(req.body);
    await newCustomer.save();
    res.status(201).send('Customer profile saved successfully');
  } catch (error) {
    console.error('Error saving customer profile:', error.message);
    res.status(400).send('Error saving customer profile: ' + error.message);
  }
});

// Fetch all customers
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update customer profile by ID
app.put('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCustomer = await Customer.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedCustomer) {
      return res.status(404).send('Customer not found');
    }
    res.json(updatedCustomer);
  } catch (error) {
    console.error('Error updating customer profile:', error.message);
    res.status(400).send('Error updating customer profile: ' + error.message);
  }
});

// Book a room (create new customer profile)
app.post('/api/bookings', async (req, res) => {
  try {
    const newBooking = new Customer(req.body);
    await newBooking.save();
    res.status(201).send('Room booked successfully');
  } catch (error) {
    console.error('Error booking room:', error.message);
    res.status(400).send('Error booking room: ' + error.message);
  }
});

// Create new staff profile
app.post('/api/staff', async (req, res) => {
  try {
    const newStaff = new Staff(req.body);
    await newStaff.save();
    res.status(201).send('Staff profile saved successfully');
  } catch (error) {
    console.error('Error saving staff profile:', error.message);
    res.status(400).send('Error saving staff profile: ' + error.message);
  }
});

// Update staff profile by ID
app.put('/api/staff/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedStaff = await Staff.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedStaff) {
      return res.status(404).send('Staff not found');
    }
    res.json(updatedStaff);
  } catch (error) {
    console.error('Error updating staff profile:', error.message);
    res.status(400).send('Error updating staff profile: ' + error.message);
  }
});

// Delete staff profile by ID
app.delete('/api/staff/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStaff = await Staff.findByIdAndDelete(id);
    if (!deletedStaff) {
      return res.status(404).send('Staff not found');
    }
    res.json({ message: 'Staff profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff profile:', error.message);
    res.status(400).send('Error deleting staff profile: ' + error.message);
  }
});

// Fetch all staff members
app.get('/api/staff', async (req, res) => {
  try {
    const staff = await Staff.find();
    res.json(staff);
  } catch (error) {
    console.error('Error fetching staff data:', error.message);
    res.status(500).send('Error fetching staff data: ' + error.message);
  }
});

// Fetch total guests across all customer records
app.get('/api/totalGuests', async (req, res) => {
  try {
    const customers = await Customer.find();
    let totalGuests = 0;
    customers.forEach(customer => {
      totalGuests += customer.totalGuests || 0;
    });
    res.json({ totalGuests });
  } catch (error) {
    console.error('Error fetching total guests:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});