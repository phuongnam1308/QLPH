import React, { useState } from 'react';
import { Calendar, Button } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs'; 

import type { CalendarProps } from 'antd';

interface DatePickerProps {
    onDateChange?: (date: Dayjs) => void;
}
const DatePicker: React.FC<DatePickerProps> = ({ onDateChange }) => {
    const [value, setValue] = useState<Dayjs>(dayjs());
    const onSelect: CalendarProps<Dayjs>['onSelect'] = (newValue) => {
        setValue(newValue); 

        if (onDateChange) {
        onDateChange(newValue);
        }
    };


    const onPanelChange: CalendarProps<Dayjs>['onPanelChange'] = (newValue) => {
        setValue(newValue);
    };

    const headerRender: CalendarProps<Dayjs>['headerRender'] = ({ value, onChange }) => {
        const current = value;

        const goToPrevMonth = () => {
            const newDate = current.subtract(1, 'month');
            onChange(newDate);
        };

        const goToNextMonth = () => {
            const newDate = current.add(1, 'month');
            onChange(newDate);
        };

        return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 8 }}>
            <div style={{ fontWeight: 600, fontSize: 16 }}>
            {current.format('MMMM YYYY')}
            </div>
            <div>
            <Button onClick={goToPrevMonth} style={{ marginRight: 8 }}>{'<'}</Button>
            <Button onClick={goToNextMonth}>{'>'}</Button>
            </div>
        </div>
        );
    };

    return ( 
        <> 
            <Calendar
                fullscreen={false}
                value={value}
                onSelect={onSelect}
                onPanelChange={onPanelChange}
                headerRender={headerRender}
            />
            <div className="infor"> 
                <ul> 
                    <li><span className="editable-dot"></span>Lịch bạn có thể chỉnh sửa</li>
                    <li><span className="color-box approved"></span>Lịch đã được duyệt</li>
                    <li><span className="color-box pending"></span>Lịch đang chờ duyệt</li>
                    <li><span className="color-box cancelled"></span>Lịch đã bị hủy</li>
                    <li><i>(Với những lịch hủy có thể đặt lịch mới đè lên lịch cũ)</i></li>
                </ul>
            </div>
        </>
    );
};

export default DatePicker;
