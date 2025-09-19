/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { format, isSameMonth } from "date-fns";
import React from "react";
import { Schedule } from "@/types/shifts";
import { formatTime } from "@/Feutures/format";

interface Props {
  date: Date;
  currentMonth: Date;
  schedule?: Schedule;
    userId: number;
  isClosed: boolean;
  onClick: (date: Date) => void;
}

const DayCell: React.FC<Props> = ({ date, currentMonth, schedule, userId, isClosed, onClick}) => {
    const isMe = schedule && schedule.user_id === userId;

    console.log("DayCell schedule:", schedule);

    const getDayStyle = () => {
        let bg = "#fff";
        const currentStatus = schedule?.status;

        if (!isSameMonth(date, currentMonth)) {
          bg = "#dbdbdf";
        } else if (currentStatus) {
          switch (currentStatus) {
            case "draft":
              bg = "#fffae6";
              break;
            case "tentative":
              bg = "#ffe0e0";
              break;
            case "confirm":
                if(isMe){
                    bg = "#d9e6f2";
                }
              break;
          }
        }

        bg = isClosed ? "#dbdbdf" : bg;

        return css`
          height: 110px;
          border: 1px solid #ccc;
          background: ${bg};
          padding: 4px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        `;
      };

  return (
    <div css={getDayStyle()} onClick={() => onClick(date)}>
      <p>{format(date, "d")}</p>
      <div css={itemCss}>
        {
            // ユーザIDが一致するスケージュールを取得
            isMe && schedule ? (
                <>
                <p>{formatTime(schedule.start_datetime.split(" ")[1].substring(0, 5))}</p>
                <span></span>
                <p>{formatTime(schedule.end_datetime.split(" ")[1].substring(0, 5))}</p>
            </>
            ) : (
                <></>
            )
        }
      </div>

    </div>
  );
};

export default DayCell;

const itemCss = css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    p {
      margin: 2px 0;
      font-size: 20px;
    }
    span{
        background-color: #000;
        width: 2px;
        height: 10px;
    }
`
