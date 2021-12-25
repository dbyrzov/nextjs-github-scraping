const cheerio = require('cheerio');
const Cors = require('cors');
let jsonframe = require('jsonframe-cheerio');

// Initializing the cors middleware
const cors = Cors({
  methods: ['POST'],
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
      fn(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result)
        }
  
        return resolve(result)
      })
    })
}

export default async (req, res) => {
    await runMiddleware(req, res, cors);
    const user = req.body.user;
    const repo = req.body.repo;
    let totalPages = 1;
    let result = [];

    if (req.method === 'POST') {
        try {
            const response = await fetch(`https://github.com/${user}/${repo}/issues?q=is%3Aopen+is%3Aissue`);
            const htmlString = await response.text();
            const $ = cheerio.load(htmlString);

            const searchContext = `em[class="current"]`;
            totalPages = $(searchContext).prop('data-total-pages') || 1;

            for (let index = 1; index <= totalPages; index++) {
              const response = await fetch(`https://github.com/${user}/${repo}/issues?page=${index}&q=is%3Aopen+is%3Aissue`);
              const htmlString = await response.text();
              const $ = cheerio.load(htmlString);
              jsonframe($);
              let frame = { 
                  "issues": {
                      _s: ".Box-row",
                      _d: [{
                          "id": ".Link--primary @ id",
                          "title": ".Link--primary",
                          "avatar": "img @ src",
                          "assignee": "img @ alt",
                          "commentsCount": ".flex-shrink-0 span:last-of-type a"
                      }]
                  }	
              }

              let r = $('body').scrape(frame, { string: true });
              result = result.concat(JSON.parse(r).issues);
            }

            res.statusCode = 200;
            return res.json(JSON.stringify(result));
        } catch (e) {
            res.statusCode = 404;
            console.log(e)
            return res.json({
              error: `not found. Tip: Double check the spelling.`,
            });
        }
    }
}
