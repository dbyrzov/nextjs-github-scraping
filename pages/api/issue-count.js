const cheerio = require('cheerio')
const Cors = require('cors')

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

    if (req.method === 'POST') {
        try {
            const response = await fetch(`https://github.com/${user}/${repo}/issues?q=is%3Aopen+is%3Aissue`);
            const htmlString = await response.text();
            const $ = cheerio.load(htmlString);
            const searchContext = `span[id="issues-repo-tab-count"]`;
            const issueCount = $(searchContext).text();

            res.statusCode = 200;
            return res.json({
                issues: issueCount
            });
        } catch (e) {
            res.statusCode = 404
            return res.json({
              error: `not found. Tip: Double check the spelling.`,
            });
        }
    }
}