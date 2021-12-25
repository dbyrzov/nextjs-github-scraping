import React from 'react'
import Issue from '../Issue/issue';
import styles from './main.module.css'
import Loading from '../loading/loading';
import { parseCookies, setCookie, destroyCookie } from 'nookies'


export default function Main() {
    const [user, setUser] = React.useState('');
    const [repo, setRepo] = React.useState('');
    const [issues, setIssues] = React.useState([]);
    const [issuesCnt, setIssuesCnt] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

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
        setCookie(null, 'github-scraper-user', user, {
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
          });
        setCookie(null, 'github-scraper-repo', repo, {
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
          });

        setIsLoading(true);
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
            setIsLoading(false);
        });
    }


    React.useState( () => {
        const cookies = parseCookies();
        setUser(cookies['github-scraper-user']);
        setRepo(cookies['github-scraper-repo']);
    }, []);


    return (
        <>
            {
                isLoading 
                ? <Loading></Loading>
                : <></>
            }

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
