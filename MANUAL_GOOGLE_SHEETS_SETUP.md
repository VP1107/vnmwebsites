# Manual: Connect Contact Form to Google Sheets & Email

This guide explains how to set up the Google Sheet and Apps Script backend to receive form submissions and send emails.

## 1. Create the Google Sheet
1.  Go to [Google Sheets](https://sheets.google.com) and create a new **Blank spreadsheet**.
2.  Name it something like **"Portfolio Leads"**.
3.  In the first row (headers), add the following columns:
    *   **A1**: `Date`
    *   **B1**: `Name`
    *   **C1**: `Email`
    *   **D1**: `Message`

## 2. Create the Google Apps Script
1.  In your spreadsheet, go to **Extensions > Apps Script**.
2.  Delete any code in the `Code.gs` file and paste the following script:

```javascript
/*
 * SCRIPT CONFIG DETAILS:
 * 1. Sheet Name: "Sheet1" (default)
 * 2. Notification Email: vm.creationteam@gmail.com
 */

const SHEET_NAME = "Sheet1";
const TO_EMAIL = "vm.creationteam@gmail.com";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const doc = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = doc.getSheetByName(SHEET_NAME);

    // key/value pairs from the form
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const nextRow = sheet.getLastRow() + 1;

    // Parse the JSON body
    const data = JSON.parse(e.postData.contents);
    
    // Prepare row data
    const newRow = headers.map(function(header) {
      if (header === 'Date') return new Date();
      // Match header names to JSON keys (case-insensitive or mapped)
      // Our React form sends: name, email, message
      const key = header.toLowerCase(); 
      return data[key] || '';
    });

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);
    
    // Send Email Notification
    sendNotificationEmail(data);

    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "row": nextRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": e }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function sendNotificationEmail(data) {
  try {
    const subject = `New Lead: ${data.name || 'Unknown'}`;
    const body = 
      `You received a new message from your portfolio website.\n\n` +
      `Name: ${data.name}\n` +
      `Email: ${data.email}\n` +
      `Message: \n${data.message}\n\n` +
      `Time: ${new Date().toLocaleString()}`;
      
    MailApp.sendEmail({
      to: TO_EMAIL,
      subject: subject,
      body: body
    });
  } catch (err) {
    console.error("Email failed", err);
  }
}

// Setup CORS (Cross-Origin Resource Sharing)
function doOptions(e) {
  var output = ContentService.createTextOutput("");
  output.setMimeType(ContentService.MimeType.TEXT);
  // Allow all origins (standard for apps script web apps usually)
  // or restrict to your domain if preferred.
  return output;
}
```

3.  (Optional) Rename the project (top left) to "Portfolio Backend".
4.  Save the project (Floppy disk icon or `Ctrl + S`).

## 3. Deploy as Web App
1.  Click the blue **Deploy** button (top right) -> **New deployment**.
2.  Click the **Select type** (gear icon) -> **Web app**.
3.  Fill in the details:
    *   **Description**: "Contact Form API"
    *   **Execute as**: **Me** (your email) — *Important!*
    *   **Who has access**: **Anyone** — *Important!* (This allows your public website to send data without login).
4.  Click **Deploy**.
    *   *Note*: You may be asked to "Authorize access". Click "Review permissions", choose your account, click "Advanced", and "Go to [Project Name] (unsafe)". This is normal for custom scripts.
5.  Copy the **Web app URL** (starts with `https://script.google.com/macros/s/...`).

## 4. Connect React Form
1.  Open `src/components/Contact/ContactForm.jsx`.
2.  Find the `GOOGLE_SCRIPT_URL` constant at the top (I have added this placeholder for you).
3.  Paste your Web App URL inside the quotes.

```javascript
// REPLACE THIS URL WITH YOUR OWN DEPLOYMENT URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_LONG_ID_HERE/exec";
```

4.  Save the file.
5.  Test the form on your localhost. You should see the row appear in your Sheet and receive an email.
