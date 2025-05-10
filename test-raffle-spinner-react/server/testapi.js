const express = require('express');
require('dotenv').config({ path: '../.env/.env' });

const app = express();
const PORT = 3000;

const API_KEY = process.env.TICKET_TAILOR_API_KEY;
const encodedKey = Buffer.from(`${API_KEY}:`).toString('base64'); 

const axios = require('axios');

async function fetchAllIssuedTickets(){
    const allTickets = [];
    let startUrl = 'https://api.tickettailor.com/v1';
    let nextUrl = startUrl + '/issued_tickets';
    // while loop to deal with pagination
    while (nextUrl){
        //config for axios api call
        let ticket_config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: nextUrl,
            headers: { 
              'Accept': 'application/json', 
              'Authorization': `Basic ${encodedKey}`
            }
        };


        const response = await axios.request(ticket_config)

        const body = response.data;

        //adds all of the ticket info into one long list
        allTickets.push(...body.data);
        nextUrl = body.links?.next || null; 
        if (nextUrl) {
            nextUrl = startUrl + nextUrl;
        }
        console.log(nextUrl);
    }
    return allTickets
}

async function fetchAllCheckedIn(){
    const allCheckedIn = []
    let startUrl = 'https://api.tickettailor.com/v1'
    let nextUrl = startUrl + '/check_ins'
    
    while (nextUrl) {
        let check_in_config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: nextUrl,
            headers: { 
              'Accept': 'application/json', 
              'Authorization': `Basic ${encodedKey}`
            }
        };

        const response = await axios.request(check_in_config);

        const body = response.data

        allCheckedIn.push(...body.data);
        nextUrl = body.links?.next || null
        if (nextUrl) {
            nextUrl = startUrl + nextUrl;
        }
        console.log(nextUrl);
    }

    return allCheckedIn;
}

app.get('/draw-slot-responses', async (req, res) => {
  try {
    //gets all of the tickets that were issued
    allTickets = await fetchAllIssuedTickets();

    allCheckedIn = await fetchAllCheckedIn();

    const removeSet = new Set(allCheckedIn.map(entry => entry.issued_ticket_id));

    const checkedInTickets = allTickets.filter(ticket => removeSet.has(ticket.id));

    res.json(checkedInTickets);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});