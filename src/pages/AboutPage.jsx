import styles from '../styles/AboutPage.module.css';

function AboutPage() {

  return (
    <main className={styles.aboutMain}>
      <h1>About This Project</h1>
      <div className={styles.aboutFeatureDiv}>
        <div className={styles.aboutFeature}>
        <h3>History</h3>
        <p>Todo Tracker is a todo list application made during the React course at Code The Dream. This application was created over the course of 11 weeks. It started off using hard coded information, and then refactored to use states and an API to store todo list information, but then bundled state management into a reducer for centralized reusability and maintainability.</p>
      </div>
      <div className={styles.aboutFeature}>
        <h3>Features</h3>
        <p>- Online task tracking</p>
        <p>- Add in your own tasks</p>
        <p>- Edit any tasks</p>
        <p>- Complete tasks</p>
      </div>
      <div className={styles.aboutFeature}>
        <h3>Technologies Used</h3>
        <p>- React</p>
        <p>- React Router</p>
        <p>- Vite server</p>
      </div>
      </div>
    </main>
  );
}

export default AboutPage;