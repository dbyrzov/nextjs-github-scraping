import styles from './home.module.css';
import Main from '../Main/main';


export default function Home() {
    return (
        <main className={styles.main}>
            <div className={styles.print}>Created by Dimitar Barzov</div>
            <h1>Github issue scraper</h1>

            <Main></Main>
        </main>
    );


}



