import React from 'react';
import styles from './issue.module.css'


export default function Issue({issue, user, repo}) {
    const [isReady, setIsReady] = React.useState(false);
    const [comments, setComments] = React.useState([]);

    const openComments = () => {
        if (isReady) {
            setIsReady(!isReady);
        } else {
            fetch('/api/comments', {
                method: 'post',
                headers: {
                  'content-type': 'application/json',
                },
                body: JSON.stringify({ user: user, repo: repo, issue: issue.id })
              })
                .then((res) => res.json())
                .then((res) => {
                    setComments(res);
                    setIsReady(!isReady);
            });
        }
    }

    return (
        <>
            <div id={issue.id} className={styles.issueCard} onClick={openComments}>
                <h2>{issue.title || "No title"}</h2>
                <div className={styles.person}>
                    <img className={styles.avatar} src={issue.avatar || "https://www.clipartmax.com/png/full/437-4374952_no-avatar-male-female.png"}></img>
                    <div>{issue.assignee || "No assignee"}</div>
                </div>
                <div>
                    Comments ({(Number(issue.commentsCount) || 0) + 1})
                </div>
                <i className="fas fa-chevron-down"></i>
            </div> 

            {
                isReady
                ?
                <div className={styles.comments}>
                    {
                        comments.map(c => 
                            <div key={c.id} className={styles.comment}>
                                <h4>{c.name} commented on {c.time.replace('T', ' ').replace('Z', '')}</h4> 
                                <p>{c.comment}</p>
                            </div>
                        )
                    }
                </div>

                :
                <></>
            }
        </>

    )

    
}