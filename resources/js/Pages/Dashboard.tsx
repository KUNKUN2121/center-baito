import { Head, Link } from '@inertiajs/react';
import { css } from '@emotion/react';
import axios from 'axios';


// Emotionでスタイル付けされたコンポーネント
const AppBar = ({ children }: { children: React.ReactNode }) => (
    <header css={styles.appBar}>
        <nav css={styles.nav}>
            {children}
        </nav>
    </header>
);

const Card = ({ children, isGradient }: { children: React.ReactNode, isGradient?: boolean }) => (
    <div css={[styles.cardBase, isGradient && styles.gradientCard]}>
        {children}
    </div>
);

const Button = ({ children, href, variant = 'primary' }: { children: React.ReactNode, href: string, variant?: 'primary' | 'secondary' }) => (
    <Link href={href} css={[styles.buttonBase, styles.buttonVariants[variant]]}>
        {children}
    </Link>
);

export default function Dashboard() {
    // サンプルデータ
    const nextShift = {
        date: '9/29',
        startTime: '16:30',
        endTime: '21:00',
    };

    const announcements = [
        { id: 1, message: '来月のシフト提出は10/10までにお願いします。' },
        { id: 2, message: '新しいドリンクの研修を行います。参加可能な方は連絡ください。' },
    ];

    const navLinks = [
        { name: 'シフト', path: '/shifts' },
        { name: 'シフト提出', path: '/shifts/request' },
    ];


    // fetchしてデータを取得する
    const fetchData = async () => {
        // axiosで個人シフトを取得する
        const response = await axios.get('/api/shifts/personal', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            withCredentials: true, // クッキーを含める
        });
        console.log(response.data);
    };



    return (
        <div>
            <Head title="Dashboard" />
            <AppBar>
                <Link href="/dashboard" css={styles.logo}>シフト管理</Link>
                <div css={styles.navLinks}>
                    {navLinks.map(link => (
                        <Link key={link.name} href={link.path} css={styles.navLink}> {link.name} </Link>
                    ))}
                </div>
            </AppBar>

            <main css={styles.container}>

                {/* 直近シフト */}
                <Card isGradient>
                    <h3 css={styles.cardTitle}>次回出勤</h3>
                    <p css={styles.shiftTime}>
                        {nextShift.date} {nextShift.startTime} - {nextShift.endTime}
                    </p>
                </Card>

                <div css={styles.gridContainer}>
                    {/* シフト管理メニュー */}
                    <Card>
                        <h3 css={styles.cardTitle}>シフト管理</h3>
                        <div css={styles.buttonGroup}>
                            <Button href="/shifts" variant="primary">
                                シフトを確認
                            </Button>
                            <Button href="/shifts/request" variant="secondary">
                                シフトを提出
                            </Button>
                        </div>
                    </Card>

                    {/* 管理者からのお知らせ */}
                    <Card>
                        <h3 css={styles.cardTitle}>お知らせ</h3>
                        <ul css={styles.list}>
                            {announcements.map((item) => (
                                <li key={item.id} css={styles.listItem}>{item.message}</li>
                            ))}
                        </ul>
                    </Card>
                </div>
            </main>
        </div>
    );
}

// Emotionのスタイル定義
const styles = {
    appBar: css`
        background-color: #1976d2; // MUI primary color
        color: white;
        padding: 0 24px;
        box-shadow: 0 2px 4px -1px rgba(0,0,0,0.2), 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12);
    `,
    nav: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 64px;
    `,
    logo: css`
        font-size: 1.25rem;
        font-weight: 700;
        letter-spacing: .2rem;
        text-decoration: none;
        color: inherit;
    `,
    navLinks: css`
        display: flex;
        gap: 24px;
    `,
    navLink: css`
        text-decoration: none;
        color: white;
        font-weight: 500;
        &:hover {
            text-decoration: underline;
        }
    `,
    container: css`
        padding: 24px;
        background-color: #f4f6f8;
        min-height: calc(100vh - 64px);
        max-width: 1200px;
        margin: 0 auto;
    `,
    pageTitle: css`
        font-size: 1.5rem;
        font-weight: 600;
        color: #333;
        margin-bottom: 24px;
    `,
    cardBase: css`
        background-color: white;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
        margin-bottom: 24px;
    `,
    gradientCard: css`
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
    `,
    cardTitle: css`
        font-size: 1.2rem;
        font-weight: bold;
        margin: 0 0 16px 0;
    `,
    shiftTime: css`
        font-size: 2rem;
        font-weight: 500;
        text-align: center;
        margin: 0;
        letter-spacing: 1px;
    `,
    gridContainer: css`
        display: grid;
        grid-template-columns: 1fr;
        gap: 24px;
        @media (min-width: 768px) {
            grid-template-columns: 1fr 1fr;
        }
    `,
    buttonGroup: css`
        display: flex;
        justify-content: space-around;
        padding: 16px 0;
    `,
    buttonBase: css`
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 10px 20px;
        border-radius: 4px;
        font-weight: bold;
        text-decoration: none;
        transition: background-color 0.3s ease;
        border: none;
        cursor: pointer;
    `,
    buttonVariants: {
        primary: css`
            background-color: #1976d2; // MUI primary
            color: white;
            &:hover {
                background-color: #1565c0;
            }
        `,
        secondary: css`
            background-color: #9c27b0; // MUI secondary
            color: white;
            &:hover {
                background-color: #7b1fa2;
            }
        `,
    },
    list: css`
        list-style: none;
        padding: 0;
        margin: 0;
    `,
    listItem: css`
        padding: 8px 0;
        border-bottom: 1px solid #eee;
        &:last-child {
            border-bottom: none;
        }
    `,
};
