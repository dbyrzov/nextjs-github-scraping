import React from 'react'
import Issue from '../Issue/issue';
import styles from './main.module.css'
import Cookie from 'universal-cookie'


export default function Main() {
    const [user, setUser] = React.useState('');
    const [repo, setRepo] = React.useState('');
    const [issues, setIssues] = React.useState([]);
    const [issuesCnt, setIssuesCnt] = React.useState('');

    const issueCount = () => {
        fetch('/api/issue-count', {
            method: 'post',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({ user: user, repo: repo })
          })
            .then((res) => res.json())
            .then((res) => {setIssuesCnt(res);
        });
    }

    const scrapeIssues = (e) => {
        e.preventDefault();
        var cookie = new Cookie();
        cookie.set('github-scraper-user2', user, {expires: new Date(Date.now()+ 86400)});
        cookie.set('github-scraper-repo', repo, {expires: new Date(Date.now()+ 86400)});

        fetch('/api/issues', {
            method: 'post',
            headers: {
            'content-type': 'application/json',
            },
            body: JSON.stringify({ user: user, repo: repo })
        })
        .then((res) => res.json())
        .then((res) => {
            res.forEach(i => {
                if (i.id) i.id = i.id.split('_')[1];
                if (i.assignee) i.assignee = i.assignee.substring(1);
            })
            setIssues(res);
        });
    }


    React.useState( () => {
        var cookie = new Cookie();
        let tmpUser = cookie.get('github-scraper-user2');
        let tmpRepo = cookie.get('github-scraper-repo');

        if (tmpUser) setUser(tmpUser);
        if (tmpRepo) setRepo(tmpRepo);
    }, []);


    return (
        <>
            <form onSubmit={scrapeIssues} className={styles.formContainer}>
                <label htmlFor="username">
                    Username:
                    <input id="username" type="text" value={user} 
                        onChange={(e) => setUser(e.target.value)}
                        onBlur={issueCount}
                />
                </label>
                
                <label htmlFor="repo">
                    Repository:
                    <input id="repo" type="text" value={repo} 
                        onChange={(e) => setRepo(e.target.value)}
                        onBlur={issueCount}
                    />
                </label>

                <label htmlFor="issues">
                    Opened issue count:
                    <span className={styles.issues}>
                        {issuesCnt > 0 ? issuesCnt : "N/A"}
                    </span>
                </label>

                <button className={styles.btnScrape}>Scrape</button>
            </form>

            <div className={styles.issueList}>
                {
                    issues.length > 0
                    ?
                        issues.map(issue => 
                            <Issue key={'_' + issue.id} issue={issue} user={user} repo={repo}></Issue>

                        )
                    :
                        [1,2,3,4,5].map(m => 
                            <div key={m} className={styles.emptyCard}>
                                <div></div>
                            </div>
                        )
                }
            </div>
        </>
    )
}