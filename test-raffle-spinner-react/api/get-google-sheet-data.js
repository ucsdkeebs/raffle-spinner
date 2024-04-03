const { google } = require('googleapis');
const { JWT } = require('google-auth-library');
const serviceAccount = require('../.env/secrets.json'); // Adjust path as necessary

module.exports = async (req, res) => {
  try {
    const auth = new JWT(
      serviceAccount.client_email,
      null,
      serviceAccount.private_key,
      ['https://www.googleapis.com/auth/spreadsheets'],
    );

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1Lj3I74Hey4GRZXofn7w_k18RvYyuytvLBJKf7EHSVcQ';
    const range = `Attendees!D2:J600`;

    const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    const values = response.data.values;
    res.status(200).json(values);
  } catch (error) {
    console.error('Error reading Google Sheet data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
