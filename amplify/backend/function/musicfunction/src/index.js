import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  DeleteCommand
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.SONGS_TABLE_NAME || "SoundwaveSongs-dev";

export const handler = async (event) => {
  console.log("Event:", JSON.stringify(event, null, 2));
  console.log("Table name:", tableName);

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Content-Type": "application/json"
  };

  try {
    const { httpMethod, pathParameters, body } = event;
    const parsedBody = body ? JSON.parse(body) : null;

    if (httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: "CORS preflight" })
      };
    }

    switch (httpMethod) {
      case "GET":
        return await getAllSongs(headers);

      case "POST":
        return await createSong(parsedBody, headers);

      case "DELETE":
        const deleteId = pathParameters?.id;
        return await deleteSong(deleteId, headers);

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: "Method not allowed" })
        };
    }
  } catch (error) {
    console.error("Lambda error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Internal server error",
        details: error.message
      })
    };
  }
};

async function getAllSongs(headers) {
  try {
    const command = new ScanCommand({ TableName: tableName });
    const result = await docClient.send(command);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.Items || [])
    };
  } catch (error) {
    console.error("Error getting songs:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to get songs" })
    };
  }
}

async function createSong(songData, headers) {
  try {
    console.log("Creating song with data:", songData);

    const song = {
      id: `song_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...songData,
      createdAt: new Date().toISOString()
    };

    const command = new PutCommand({
      TableName: tableName,
      Item: song
    });

    await docClient.send(command);

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify(song)
    };
  } catch (error) {
    console.error("Error creating song:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to create song", details: error.message })
    };
  }
}

async function deleteSong(id, headers) {
  try {
    const command = new DeleteCommand({
      TableName: tableName,
      Key: { id }
    });

    await docClient.send(command);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Song deleted successfully" })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to delete song" })
    };
  }
}