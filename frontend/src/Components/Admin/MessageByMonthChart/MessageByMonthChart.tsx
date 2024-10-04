
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MessageCount } from '../../../Page/Dashboard/Index';

interface MessagesByMonthChartProps {
    totalMessageCount: MessageCount[]
}

const MessagesByMonthChart = ({ totalMessageCount }: MessagesByMonthChartProps) => {

    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart
                data={totalMessageCount}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="month"
                    label={{ value: 'Month', position: 'insideBottomRight', offset: -5 }}
                    tickFormatter={(month) => monthNames[month - 1]}
                />
                <YAxis
                    label={{ value: 'Messages', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default MessagesByMonthChart;
