import React, { useState } from "react";
import Calendar from "../components/Calendar";
import DatePicker from "../components/DatePicker";
import { Dayjs } from "dayjs";
const Home = (): React.JSX.Element => {
	const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
	return (
		<>
			<div className="home-content">
				<div className="date-picker-wrapper">
					<DatePicker onDateChange={setSelectedDate} />
				</div>
				<div className="calendar-wrapper">
					<Calendar gotoDate={selectedDate} />
				</div>
			</div>
		</>
	);
};

export default Home;
