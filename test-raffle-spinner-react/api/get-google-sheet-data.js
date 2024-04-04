const serviceAccount = JSON.parse(process.env.API_KEY);
const { google } = require('googleapis');
const { JWT } = require('google-auth-library')

const spreadsheetId = '1Lj3I74Hey4GRZXofn7w_k18RvYyuytvLBJKf7EHSVcQ';

// fetches the google sheet data from a specific range
module.exports = async (req, res) => {
    //console.log("api test");
    try {
        // creates auth credentials to use the service account
        const auth = new JWT(
            serviceAccount.client_email,
            null,
            serviceAccount.private_key,
            ['https://www.googleapis.com/auth/spreadsheets'], //the scope of the permissions
        );
  
        const sheets = google.sheets({ version: 'v4', auth });
  
        // gets the last row of Attendees that has data
        //const lastRow = sheets.data.sheets[0].data[0].rowData.length;
        // Specify the range you want to read
        const range = `Attendees!D2:J600`; // Update with your desired range
  
        // Actually gets the spreadsheet values after passing the spreadsheetId and the range of values
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });
    
        // sets the values to the response of the api and returns as a json
        const values = response.data.values;
        res.json(values);
    } catch (error) {
        console.error('Error reading Google Sheet data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};