const cheerio = require('cheerio');
const Cors = require('cors');
let jsonframe = require('jsonframe-cheerio');
// import cookie from 'cookie';

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
    const issue = req.body.issue;

    if (req.method === 'POST') {
        try {
            const response = await fetch(`https://github.com/${user}/${repo}/issues/${issue}`);
            const htmlString = await response.text();
            const $ = cheerio.load(htmlString);
            jsonframe($);

            let frame = { 
                "comments": {
                    _s: ".timeline-comment",
                    _d: [{
                        "name": "h3 strong a",
                        "id": "h3 a:nth-of-type(2) @ href",
                        "time": "h3 a:nth-of-type(2) relative-time @ datetime",
                        "comment": ".edit-comment-hide task-lists table tr td p",
                    }]
                }	
            }

            let result = $('body').scrape(frame, { string: true });
            res.statusCode = 200;
            return res.json(JSON.stringify(JSON.parse(result).comments));
        } catch (e) {
            res.statusCode = 404
            return res.json({
              error: `not found. Tip: Double check the spelling.`,
            });
        }
    }
}