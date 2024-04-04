const serviceAccount = JSON.parse(process.env.API_KEY);
const { google } = require('googleapis');
const { JWT } = require('google-auth-library')

const spreadsheetId = '1Lj3I74Hey4GRZXofn7w_k18RvYyuytvLBJKf7EHSVcQ';

// finds which row to place the most recent winner on, for more private info to verify
module.exports = async (req, res) => {
    //console.log("api test");
    try {
      // creates credentials for service account
      const auth = new JWT(
        serviceAccount.client_email,
        null,
        serviceAccount.private_key,
        ['https://www.googleapis.com/auth/spreadsheets'],
      );
  
      const sheets = google.sheets({ version: 'v4', auth });
  
      const range = `Attendees!I2:I600`; // Update with desired range
  
      // queries from the spreadsheet
      const response = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range,
      });
  
      // returns the values of the "won yet" column as .json
      const values = response.data.values;
      res.json(values);
    } catch (error) {
      console.error('Error reading Google Sheet data:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};