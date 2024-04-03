const { google } = require('googleapis');
const { JWT } = require('google-auth-library');
const serviceAccount = require('../.env/secrets.json'); // Adjust the path as necessary

module.exports = async (req, res) => {
  try {
    const { originalIndex, newRow, name, email, orderid } = req.query; // Adjust if using POST and payload body

    const auth = new JWT(
      serviceAccount.client_email,
      null,
      serviceAccount.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1Lj3I74Hey4GRZXofn7w_k18RvYyuytvLBJKf7EHSVcQ';

    // Update won item to TRUE in Attendees sheet
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Attendees!I${originalIndex}`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [['TRUE']] },
    });

    // Update Winners sheet with new winner information
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Winners!A${newRow}:C${newRow}`,
      valueInputOption: 'RAW',
      resource: { values: [[name, email, orderid]] },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
