import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { css } from '@emotion/react';
import ViewCalender from '@/Components/NormalCalender/ViewCalender';
import { Schedule } from '@/types/shifts';
import { useEffect, useState } from 'react';
import axios from 'axios';

// シフト希望画面
export default function Request() {
    const [data, setData] = useState<Schedule[]>(null!);
    const [scheduleId, setScheduleId] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [recruitmentDate, setRecruitmentDate] = useState<string | null>(null);

    // fetchしてデータを取得する
    const fetchData = async () => {
        try {
            const response = await axios.get('/api/shifts/request', {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                withCredentials: true, // クッキーを含める
            });


            if (response.status === 204) {
                setScheduleId(0);
            }
            if(response.status !== 200){
                throw new Error(`Unexpected response status: ${response.status}`);
            }
            const jsonData = response.data;

            setData(jsonData.shiftSubmissions);
            setScheduleId(jsonData.scheduleId);
            setRecruitmentDate(jsonData.date);

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    // コンポーネントがマウントされたときにデータを取得する
    useEffect(() => {
        fetchData();
    }, []);

    // fetch
    const handleChangeShift = (schedule: Schedule) => {
        setData((prevData) => {
            const existingIndex = prevData.findIndex((s) => s.id === schedule.id);
            if (existingIndex !== -1) {
                // 既存のスケジュールを更新
                const updatedData = [...prevData];
                updatedData[existingIndex] = schedule;
                return updatedData;
            } else {
                // 新しいスケジュールを追加
                return [...prevData, schedule];
            }
        });
    };

    if(scheduleId === 0){
        return <div>
            <Head title="シフト希望" />
            現在シフト募集中ではありません。
            </div>;
    }


    if(!data){
        return <div>
            <Head title="シフト希望" />
            Loading...
            </div>;
    }


    const handleSubmitModal = (newSchedule: Omit<Schedule, 'id' | 'user_id'>) => {
        // POSTする前にdataを更新
        const userId = 1; // 仮のユーザーID、実際には認証されたユーザーのIDを使用する
        handleChangeShift({
            ...newSchedule,
            user_id: userId,
        } as Schedule);

        console.log("Submitting new schedule:", newSchedule, "with scheduleId:", scheduleId);

        axios.post('/api/shifts/create', {
            newSchedule,
            scheduleId
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            withCredentials: true, // クッキーを含める
        })
        .then(response => {
            // 成功時の処理 dataを更新する
            console.log("Shift created successfully:", response.data);
            fetchData(); // サーバーから最新のデータを取得して更新
        })
        .catch(error => {
            console.error("There was an error creating the shift:", error);
        });


        setSelectedDate(null);
    };




    console.log("Fetched data:", data);
    return (
        <div css={wapper}>
            <Head title="シフト希望" />
            <h1 css={titleCss}>{recruitmentDate} の シフト希望</h1>
            <div css={announceWapper}>
                <p>ここはアナウンスです。アナウンスです。アナウンスです。アナウンスです。アナウンスです。アナウンスです。アナウンスアナウンスです。アナウンスです。アナウンスです。アナウンスです。ですアナウンスです。アナウンスです。アナウンスです。アナウンスです。。</p>
            </div>
            <div>
                <ViewCalender
                    requestMonth={recruitmentDate?.replace('年', '-').replace('月', '') || '2025-09'}
                    schedules={data}
                    closedDays={[]}
                    userId={1}
                    handleChangeShift={handleChangeShift}
                    handleSubmitModal={handleSubmitModal}
                    setSelectedDate={setSelectedDate}
                    selectedDate={selectedDate}
                />
            </div>
        </div>
    );
}

const wapper = css`
    margin: 0 auto;
    max-width: 1200px;
`;
const titleCss = css`
    font-size: 24px;
    text-align: center;
    margin: 20px 0;
`;


const announceWapper = css`
    text-align: center;
    margin-bottom: 20px;
    width: 80%;
    margin: 0 auto;

    @media screen and (max-width: 768px) {
        width: 95%;
    }
`
