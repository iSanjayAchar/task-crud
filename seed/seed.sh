#!/bin/bash

# Set the URL for the POST request
POST_URL="http://localhost:3000/task"

# Specify the path to your text file
TEXT_FILE="tasks.txt"

# Check if the text file exists
if [ ! -f "$TEXT_FILE" ]; then
  echo "Text file not found: $TEXT_FILE"
  exit 1
fi

# Read each line from the text file and make a POST request
while IFS=, read -r title status created_at updated_at; do
  # Create a JSON object with task details
  DATA="{\"title\":\"$title\",\"status\":\"$status\",\"created_at\":\"$created_at\",\"updated_at\":\"$updated_at\"}"

  # Make the POST request using curl
  curl -X POST -H "Content-Type: application/json" -d "$DATA" "$POST_URL"

  # Sleep for a short time to avoid overloading the server (adjust as needed)
  sleep 1
done < "$TEXT_FILE"
