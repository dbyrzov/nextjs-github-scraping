import styles from './home.module.css';


export default function Home() {
    let username = "";
    let repo = "";

    return (
        <main className={styles.main}>
            <h1>Github issue scrapper</h1>
            <div action={`https://github.com/${username}/${repo}/issues`} className={styles.divContainer}>
                <label htmlFor="username">
                    Enter your username:
                    <input id="username" type="text" />
                </label>
                
                <label htmlFor="repo">
                    Enter your repository name:
                    <input id="repo" type="text"/>
                </label>

                <button>Scrape</button>
            </div>

            <footer className={styles.footer}>
                Created by Dimitar Barzov
            </footer>
        </main>
    );
}

