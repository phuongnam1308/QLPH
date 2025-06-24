import React from "react";
import Calendar from "../components/Calendar";
import DatePicker from "../components/DatePicker";
const Home = (): React.JSX.Element => {
	return (
		<>
			<div className="home-content">
				<div className="date-picker-wrapper">
					<DatePicker />
				</div>
				<div className="calendar-wrapper">
					<Calendar />
				</div>
			</div>
		</>
	);
};

export default Home;
