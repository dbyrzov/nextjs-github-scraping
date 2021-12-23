import React from 'react'
import styles from './main.module.css'


export default function Form() {
    const [user, setUser] = React.useState('');
    const [repo, setRepo] = React.useState('');
    const [issues, setIssues] = React.useState([]);
    const [issuesCnt, setIssuesCnt] = React.useState('');
    let typingTimer;
    let typingInterval = 2000;

    const issueCount = () => {
        fetch('/api/issue-count', {
            method: 'post',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({ user: user, repo: repo })
          })
            .then((res) => res.json())
            .then((res) => {
              setIssuesCnt(res.issues);
        });
    }

    const scrapeIssues = (e) => {
        e.preventDefault();
        fetch('/api/issues', {
            method: 'post',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({ user: user, repo: repo })
          })
            .then((res) => res.json())
            .then((res) => {
                let json = JSON.parse(res.issues);
                console.log(json.issues);
                setIssues(json.issues);
        });
    }

    const onKeyUpHandle = () => {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(issueCount, typingInterval);
    }

    return (
        <>
            <form onSubmit={scrapeIssues} className={styles.formContainer}>
                <label htmlFor="username">
                    Username:
                    <input id="username" type="text" value={user} 
                    onChange={(e) => setUser(e.target.value)}
                    onKeyUp={onKeyUpHandle}
                    onKeyDown={clearTimeout(typingTimer)}
                />
                </label>
                
                <label htmlFor="repo">
                    Repository:
                    <input id="repo" type="text" value={repo} 
                        onChange={(e) => setRepo(e.target.value)}
                        onKeyUp={onKeyUpHandle}
                        onKeyDown={clearTimeout(typingTimer)}
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
                        issues.map(issue = 
                            <div>issue.title</div>

                        )
                    :
                        [1,2,3,4,5].map(m => 
                            <div className={styles.emptyCard}>
                                <div></div>
                            </div>
                        )
                }
            </div>
        </>


        
    )
}