import React, { useState } from 'react';
import { Calendar, Button } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs'; 
 
import type { CalendarProps } from 'antd';

const MyCustomCalendar: React.FC = () => {
  const [value, setValue] = useState<Dayjs>(dayjs());

  const onSelect: CalendarProps<Dayjs>['onSelect'] = (newValue) => {
    setValue(newValue);
    console.log('Ngày được chọn:', newValue.format('YYYY-MM-DD'));
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
    <div style={{ width: 350, margin: '0 auto', padding: 16 }}>
      <Calendar
        fullscreen={false}
        value={value}
        onSelect={onSelect}
        onPanelChange={onPanelChange}
        headerRender={headerRender}
      />
    </div>
  );
};

export default MyCustomCalendar;
