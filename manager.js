// ################################################################################
// Data service operations setup

const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

// Load the schemas...

// Data entities; the standard format is:
const questionSchema = require("./msc-question.js");
// Add others as needed

// ################################################################################
// Define the functions that can be called by server.js

module.exports = function() {
  // Collection properties, which get their values upon connecting to the database
  let Questions;

  return {
    // ############################################################
    // Connect to the database

    connect: function() {
      return new Promise(function(resolve, reject) {
        // Create connection to the database
        console.log("Attempting to connect to the database...");

        // The following works for localhost...
        // Replace the database name with your own value
        mongoose.connect(process.env.DB_CONNECTION_STRING, {
          connectTimeoutMS: 5000,
          useUnifiedTopology: true
        });

        // This one works for MongoDB Atlas...
        // (coming soon)

        // From https://mongoosejs.com/docs/connections.html
        // Mongoose creates a default connection when you call mongoose.connect().
        // You can access the default connection using mongoose.connection.
        var db = mongoose.connection;

        // Handle connection events...
        // https://mongoosejs.com/docs/connections.html#connection-events
        // The data type of a connection event is string
        // And more than one connection event may be emitted during execution

        // FYI the Node.js EventEmitter class docs is here...
        // https://nodejs.org/api/events.html#events_class_eventemitter

        // Handle the unable to connect scenario
        // "on" is a Node.js method in the EventEmitter class
        // https://nodejs.org/api/events.html#events_emitter_on_eventname_listener
        db.on("error", error => {
          console.log("Connection error:", error.message);
          reject(error);
        });

        // Handle the open/connected event scenario
        // "once" is a Node.js method in the EventEmitter class
        // https://nodejs.org/api/events.html#events_emitter_once_eventname_listener
        db.once("open", () => {
          console.log("Connection to the database was successful");
          Questions = db.model("questions", questionSchema, "questions");
          // Add others here...

          resolve();
        });
      });
    },

    // ############################################################
    // Question requests - only allow readonly requests

    questionGetAll: function() {
      return new Promise(function(resolve, reject) {
        // Fetch all documents
        // During development and testing, can "limit" the returned results to a smaller number
        // Remove that function call when deploying into production
        Questions.find()
          .sort({ order: "asc" })
          .exec((error, items) => {
            if (error) {
              // Query error
              return reject(error.message);
            }
            // Found, a collection will be returned
            return resolve(items);
          });
      });
    },

    questionGetById: function(itemId) {
      return new Promise(function(resolve, reject) {
        // Find one specific document
        Questions.findOne({ order: itemId }, (error, item) => {
          if (error) {
            // Find/match is not found
            return reject(error.message);
          }
          // Check for an item
          if (item) {
            // Found, one object will be returned
            return resolve(item);
          } else {
            return reject("Not found");
          }
        });
      });
    }
  }; // return statement that encloses all the function members
}; // module.exports
