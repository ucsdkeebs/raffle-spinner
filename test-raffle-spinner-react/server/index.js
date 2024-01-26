const serviceAccount = require('../src/secrets.json');
const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const { JWT } = require('google-auth-library')

const app = express();
const PORT = 3001;

app.use(cors());

// Replace with your service account key file and spreadsheet ID

const spreadsheetId = '1GKyP_61jo1Btik3lX_qalejXb_0txDFv5dvhEJ20S24';

app.get('/api/get-google-sheet-data', async (req, res) => {
  console.log("api test");
  try {
    const auth = new JWT(
      serviceAccount.client_email,
      null,
      serviceAccount.private_key,
      ['https://www.googleapis.com/auth/spreadsheets'],
    );

    const sheets = google.sheets({ version: 'v4', auth });

    // gets the last row of Attendees that has data
    //const lastRow = sheets.data.sheets[0].data[0].rowData.length;
    // Specify the range you want to read
    const range = `Attendees!D2:I203`; // Update with your desired range

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
    });

    const values = response.data.values;
    res.json(values);
  } catch (error) {
    console.error('Error reading Google Sheet data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/add-winner/:originalIndex/:newRow/:name/:email', async (req, res) => {
  try {
    const auth = new JWT(
      serviceAccount.client_email,
      null,
      serviceAccount.private_key,
      ['https://www.googleapis.com/auth/spreadsheets'],
    );

    const sheets = google.sheets({ version: 'v4', auth });

    console.log(req.params);
    // Update won item to TRUE
    const updateAttendees = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Attendees!I${req.params.originalIndex}`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [['TRUE']],
      },
    });

    // Log the update response (optional)
    console.log('Update Response');

    const updateWinners = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Winners!A${req.params.newRow}:B${req.params.newRow}`,
      valueInputOption: 'RAW',
      resource: {
        values: [[req.params.name, req.params.email]],
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating cell value:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});