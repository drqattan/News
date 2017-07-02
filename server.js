/* Scraper:  */

// Dependencies:

// Snatches HTML from URLs
var request = require("request");
// Scrapes our HTML
var cheerio = require("cheerio");
// express and monojs npm packages. 
var express = require("express");
var mogojs = require("monojs");

// initialize express
var app = express();

// Database configuration. 
// save the URL of our database as well as the name of the database.
var databaseUrl = "NYT";
var collections = ["news"];

// Use mongojs to hook the database to the db variable
var db = mongojs(databaseUrl, collections);

// This makes sure that any errors are logged if mongodb runs into an issue
db.on("error", function(error) {
    console.log("Database Error:", error);
});

// First, tell the console what server.js is doing
console.log("\n***********************************\n" +
    "Grabbing every thread name and link\n" +
    "from reddit's webdev board:" +
    "\n***********************************\n");


// Making a request call for reddit's "webdev" board. The page's HTML is saved as the callback's third argument
request("https://www.nytimes.com/?mcubz=0", function(error, response, html) {

    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(html);

    // An empty array to save the data that we'll scrape
    var result = [];

    // With cheerio, find each p-tag with the "title" class
    // (i: iterator. element: the current element)
    $("h2.story-heading").each(function(i, element) {

        // Save the text of the element (this) in a "title" variable
        var title = $(this).text();

        // In the currently selected element, look at its child elements (i.e., its a-tags),
        // then save the values for any "href" attributes that the child elements may have
        var link = $(element).children().attr("href");

        // Save these results in an object that we'll push into the result array we defined earlier
        result.push({
            title: title,
            link: link
        });

    });

    // Log the result once cheerio analyzes each of its selected elements
    console.log(result);


    db.news.insert(result.push({
        title: title,
        link: link
    }));
});

// page to upload the news feed. 
app.get("/", function(req, res) {
            db.news.find({}, function(error, found) {

                if (error) {
                    console.log(error);
                } else {
                    res.json(found);
                };
            });


            // app listner on port 3000
            app.listen(3000, function() {
                console.log("app running on port 3000 (*_*)")
            });