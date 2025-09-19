import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { css } from '@emotion/react';
import ViewCalender from '@/Components/NormalCalender/ViewCalender';
import { Schedule } from '@/types/shifts';
import { useEffect, useState } from 'react';

const wapper = css`

`;

// シフト希望画面
export default function Request() {
    const [data, setData] = useState<Schedule[]>(null!);

    // fetchしてデータを取得する
    const fetchData = async () => {
        try {
            const response = await fetch('/api/shifts/request', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include', // クッキーを含める
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // data = await response.json();
            const jsonData = await response.json();
            console.log("Fetched schedules:", jsonData);
            setData(jsonData);

            // ここでstateにデータをセットするなどの処理を行う
        }
        catch (error) {
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

    if(!data){
        return <div>Loading...</div>;
    }


    console.log("Fetched data:", data);
    return (
        <div css={wapper}>
            <div>
                <ViewCalender
                    requestMonth="2025/09"
                    schedules={data}
                    closedDays={[]}
                    userId={1}
                    handleChangeShift={handleChangeShift}
                />
            </div>
        </div>
    );
}
