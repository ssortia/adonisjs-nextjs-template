import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import UserProfile from './components/UserProfile';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol>
          <li>AdonisJS + Next.js Template</li>
          <li>С готовой системой аутентификации и ролями</li>
        </ol>

        {/* Здесь размещаем профиль пользователя или кнопки авторизации */}
        <div className="mt-8 w-full max-w-md">
          <UserProfile />
        </div>

        <div className={styles.ctas}>
          <Link href="/register" className={styles.primary}>
            Регистрация
          </Link>
          <Link href="/login" className={styles.secondary}>
            Войти в систему
          </Link>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}