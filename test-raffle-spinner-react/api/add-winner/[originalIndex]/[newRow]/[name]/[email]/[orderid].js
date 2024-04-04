const serviceAccount = JSON.parse(process.env.API_KEY);
const { google } = require('googleapis');
const { JWT } = require('google-auth-library')

const spreadsheetId = '1Lj3I74Hey4GRZXofn7w_k18RvYyuytvLBJKf7EHSVcQ';

module.exports = async (req, res) => {
    try {
      // Extract path parameters from `req.query`
      const { originalIndex, newRow, name, email, orderid } = req.query;
  
      // credential creation
      const auth = new JWT(
        serviceAccount.client_email,
        null,
        serviceAccount.private_key,
        ['https://www.googleapis.com/auth/spreadsheets'],
      );
  
      const sheets = google.sheets({ version: 'v4', auth });
  
      // Update won item to TRUE inside of Attendees sheet
      const updateAttendees = await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `Attendees!I${originalIndex}`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [['TRUE']],
        },
      });
  
      // Updates the winners sheet to have the information of the new winner
      const updateWinners = await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `Winners!A${newRow}:C${newRow}`,
        valueInputOption: 'RAW',
        resource: {
          values: [[name, email, orderid]],
        },
      });
  
      res.json({ success: true });
    } catch (error) {
      console.error('Error updating cell value:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };