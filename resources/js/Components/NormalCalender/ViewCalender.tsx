/** @jsxImportSource @emotion/react */
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { css } from "@emotion/react";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
} from "date-fns";
import DayCell from "./DayCell";
import ScheduleModal from "./ScheduleModal";
import { ClosedDay, Schedule } from "@/types/shifts";
import { Alert } from "@mui/material";
import { on } from "events";
import { formatTime } from "@/Feutures/format";
import axios from "axios";


const wapperCss = css`
    max-width: 800px;
    margin: 0 auto;
`;
const calendarGrid = css`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

const header = css`
  text-align: center;
  font-size: 24px;
  margin-bottom: 16px;
`;

interface CalendarProps {
    requestMonth: string;
    schedules: Schedule[];
    closedDays: ClosedDay[];
    userId: number;
    handleChangeShift: (schedule: Schedule) => void;
    handleSubmitModal: (newSchedule: Omit<Schedule, 'id' | 'user_id'>) => void;
    selectedDate: Date | null;
    setSelectedDate: Dispatch<SetStateAction<Date | null>>;
}

const ViewCalender = ({
    requestMonth,
    schedules,
    closedDays,
    userId,
    handleChangeShift,
    handleSubmitModal,
    selectedDate,
    setSelectedDate
}: CalendarProps) => {
    const currentDate = new Date(requestMonth.replace("/", "-") + "-01");

    const handleDayClick = (date: Date) => {
        setSelectedDate(date);
    };

    const handleCloseModal = () => {
        setSelectedDate(null);
    };

    // postする
    // 新しい希望シフトを追加する関数


    const handleDeleteSchedule = (work_date: string) => {
        console.log("Delete:", work_date);
        // ここで実際にシフトを削除する処理を呼び出す
        setSelectedDate(null);
    }

    console.log("schedules in ViewCalender:", schedules);

  const start = startOfWeek(startOfMonth(currentDate));
  const end = endOfWeek(endOfMonth(currentDate));
  const days = [];
  let date = start;

  while (date <= end) {
    days.push(date);
    date = addDays(date, 1);
  }


  return (
    <div css={wapperCss}>
      {/* <div css={header}>{format(currentDate, "yyyy年 MM月")}</div> */}
      <div css={calendarGrid}>
        {["日", "月", "火", "水", "木", "金", "土"].map((d) => (
          <div key={d} css={{ textAlign: "center", border: "1px solid #ccc", background: "#eee", padding: 4 }}>
            {d}
          </div>
        ))}
        {days.map((day) => {
        const key = format(day, "yyyy-MM-dd");
        const schedule = schedules.find((s) => s.start_datetime.startsWith(key));
        // console.log("Matching schedule for", key, ":", schedule);
          const isClosed = closedDays.some((closedDay) => closedDay.date === key);
          return (
            <DayCell
              key={key}
              date={day}
              currentMonth={currentDate}
              schedule={schedule}
              userId={userId}
              isClosed={isClosed}
              onClick={() => handleDayClick(day)}
            />
          );
        })}
      </div>

      {selectedDate && (
        <ScheduleModal
            date={selectedDate}
            onClose={handleCloseModal}
            onSubmit={handleSubmitModal}
            // schedules={schedules.filter(s => s.start_datetime === format(selectedDate, "yyyy-MM-dd"))}
            schedules={schedules.filter(s => s.start_datetime.startsWith(format(selectedDate, "yyyy-MM-dd")))}
            deleteSchedule={handleDeleteSchedule}
        />
      )}
    </div>
  );
};

export default ViewCalender;
