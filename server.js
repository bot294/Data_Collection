const express = require("express");
const bodyParser = require("body-parser");
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const path = require("path"); // Make sure 'path' module is required
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = 5000;

// Set up middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// AWS SDK v3 Configuration
const client = new DynamoDBClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: "AKIAW4FDLNOVNKXKVZ7D",
    secretAccessKey: "lAu105X0c552lRCw6H4e5C/cyfm3jZyWrXkYtur8",
  },
});

const tableName = "Companies"; // Replace with your DynamoDB table name

// Route to serve the form page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Route to handle form data submission
app.post("/submit", async (req, res) => {
  const { companyName, contactName, contactNumber, startingLine, background, assistance } = req.body;

  // Prepare the data for DynamoDB (wrapped in appropriate DynamoDB data types)
  const params = {
    TableName: tableName,
    Item: {
      CompanyName: { S: companyName }, // Use the variable from the destructured body
      ContactName: { S: contactName },
      ContactNumber: { S: contactNumber },
      StartingLine: { S: startingLine },
      Background: { S: background },
      Assistance: { S: assistance },
    },
  };

  try {
    // Use the PutItemCommand to store data into DynamoDB
    const command = new PutItemCommand(params); // Correct usage of PutItemCommand
    const data = await client.send(command);
    console.log("Data stored successfully:", data);
    res.json({ message: "Data submitted successfully!" });
  } catch (err) {
    console.error("Error storing data to DynamoDB:", err);
    res.status(500).json({ message: "Error storing data to DynamoDB" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
