const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

// Replace with your service account key file and spreadsheet ID
const serviceAccount = require('./secrets.json');
const spreadsheetID = '1GKyP_61jo1Btik3lX_qalejXb_0txDFv5dvhEJ20S24';

app.get('/api/get-google-sheet-data', async (req, res) => {
  console.log("api test!");
  try {
    const auth = new google.auth.JWT(
      serviceAccount.client_email,
      null,
      serviceAccount.private_key,
      ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    );

    const sheets = google.sheets({ version: 'v4', auth });

    // gets the last row of Attendees that has data
    const lastRow = sheets.data.sheets[0].data[0].rowData.length;
    // Specify the range you want to read
    const range = `Attendees!D2:I${lastRow}`; // Update with your desired range

    const response = await sheets.spreadsheets.values.get({
      spreadsheetID,
      range,
    });

    const values = response.data.values;

    res.json(values);
  } catch (error) {
    console.error('Error reading Google Sheet data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});